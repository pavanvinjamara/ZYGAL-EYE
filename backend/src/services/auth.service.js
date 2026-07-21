const userRepo = require('../repositories/user.repository');
const vendorRepo = require('../repositories/vendor.repository');
const refreshTokenRepo = require('../repositories/refreshToken.repository');
const { hashPassword, comparePassword } = require('../utils/password.util');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  refreshExpiryDate,
} = require('../utils/jwt.util');

class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.status = status;
  }
}

async function login({ vendorCode, email, password }, meta = {}) {
  const vendor = await vendorRepo.findByCode(vendorCode);
  if (!vendor) throw new AuthError('Invalid vendor selection', 400);

  console.log(vendor, vendorCode);

  const user = await userRepo.findByEmail(email);
  console.log(user.vendorId, String(user.vendorId),String(vendor._id));
  if (!user || String(user.vendorId) !== String(vendor._id)) {
    throw new AuthError('Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new AuthError('Account disabled. Contact your administrator.', 403);
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AuthError('Account temporarily locked due to failed attempts. Try again later.', 423);
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    await userRepo.recordFailedLogin(user._id);
    throw new AuthError('Invalid email or password');
  }

  await userRepo.recordSuccessfulLogin(user._id);

  const payload = {
    sub: String(user._id),
    vendorId: String(user.vendorId),
    role: user.role,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await refreshTokenRepo.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    userAgent: meta.userAgent,
    ip: meta.ip,
    expiresAt: refreshExpiryDate(),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      vendor: {
        id: vendor._id,
        code: vendor.code,
        name: vendor.name,
        shortCode: vendor.shortCode,
      },
    },
  };
}

async function register({ vendorCode, name, email, password, phone }) {
  const vendor = await vendorRepo.findByCode(vendorCode);
  if (!vendor) throw new AuthError('Invalid vendor selection', 400);

  const existing = await userRepo.findByEmail(email);
  if (existing) throw new AuthError('Email already registered', 409);

  const passwordHash = await hashPassword(password);
  const user = await userRepo.createUser({
    vendorId: vendor._id,
    name,
    email,
    passwordHash,
    role: 'vendor_viewer',
    phone: phone || null,
  });

  return { id: user._id, name: user.name, email: user.email };
}

async function refresh(refreshTokenValue) {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw new AuthError('Invalid or expired refresh token');
  }

  const stored = await refreshTokenRepo.findValidByHash(hashToken(refreshTokenValue));
  if (!stored) throw new AuthError('Refresh token revoked or not found');

  const accessToken = signAccessToken({
    sub: decoded.sub,
    vendorId: decoded.vendorId,
    role: decoded.role,
  });

  return { accessToken };
}

async function logout(refreshTokenValue) {
  if (!refreshTokenValue) return;
  await refreshTokenRepo.revokeByHash(hashToken(refreshTokenValue));
}

module.exports = { login, register, refresh, logout, AuthError };