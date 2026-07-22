// backend/src/services/auth.service.js
const userRepo = require('../repositories/user.repository');
const vendorRepo = require('../repositories/vendor.repository');
const refreshTokenRepo = require('../repositories/refreshToken.repository');
const auditRepo = require('../repositories/audit.repository');
const { hashPassword, comparePassword, isStrongPassword } = require('../utils/password.util');
const { signAccessToken, generateRefreshToken, refreshTokenExpiry, verifyAccessToken } = require('../utils/jwt.util');

function toAuthClaims(user) {
  return {
    sub: String(user._id),
    role: user.role,
    vendorId: user.vendorId ? String(user.vendorId) : null,
  };
}

function stripPassword(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

async function login({ email, password, vendorShortCode }, meta = {}) {
  const user = await userRepo.findByEmail(email);
  if (!user || user.status !== 'active') {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  // Vendor users must select their company on login. Internal IIFL staff
  // (user.vendorId === null) skip this entirely.
  if (user.vendorId) {
    if (!vendorShortCode) {
      throw Object.assign(new Error('vendorShortCode is required for vendor accounts'), { statusCode: 400 });
    }
    const vendor = await vendorRepo.findByShortCode(vendorShortCode);
    if (!vendor || String(vendor._id) !== String(user.vendorId)) {
      throw Object.assign(new Error('Vendor mismatch'), { statusCode: 401 });
    }
  }

  await userRepo.touchLogin(user._id);

  const token = signAccessToken(toAuthClaims(user));
  const refreshToken = generateRefreshToken();

  await refreshTokenRepo.create({
    userId: user._id,
    token: refreshToken,
    userAgent: meta.userAgent,
    ip: meta.ip,
    expiresAt: refreshTokenExpiry(),
  });

  return { token, refreshToken, user: stripPassword(user) };
}

async function refresh(refreshToken) {
  const stored = await refreshTokenRepo.findByToken(refreshToken);
  if (!stored || stored.expiresAt < new Date()) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }

  const user = await userRepo.findById(stored.userId);
  if (!user || user.status !== 'active') {
    throw Object.assign(new Error('User not found or inactive'), { statusCode: 401 });
  }

  return { token: signAccessToken(toAuthClaims(user)) };
}

async function logout(refreshToken) {
  if (refreshToken) await refreshTokenRepo.revoke(refreshToken);
}

async function getMe(userId) {
  const user = await userRepo.findById(userId);
  if (!user) throw Object.assign(new Error('Not found'), { statusCode: 404 });
  return stripPassword(user);
}

async function register({ name, email, password, role, vendorId }, actorUserId, meta = {}) {
  if (!isStrongPassword(password)) {
    throw Object.assign(new Error('Password must be 8+ characters with a letter and a number'), { statusCode: 400 });
  }

  const existing = await userRepo.findByEmail(email);
  if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });

  const passwordHash = await hashPassword(password);
  const result = await userRepo.create({ name, email, passwordHash, role, vendorId, status: 'invited' });

  await auditRepo.log({
    userId: actorUserId || result.insertedId,
    action: 'user.register',
    targetType: 'user',
    targetId: String(result.insertedId),
    ip: meta.ip,
  });

  return { _id: result.insertedId };
}

async function changePassword(userId, oldPassword, newPassword) {
  if (!isStrongPassword(newPassword)) {
    throw Object.assign(new Error('Password must be 8+ characters with a letter and a number'), { statusCode: 400 });
  }

  const user = await userRepo.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const matches = await comparePassword(oldPassword, user.passwordHash);
  if (!matches) throw Object.assign(new Error('Current password incorrect'), { statusCode: 400 });

  const newHash = await hashPassword(newPassword);
  await userRepo.setPasswordHash(user._id, newHash);
  await refreshTokenRepo.revokeAllForUser(user._id);
}

module.exports = { login, refresh, logout, getMe, register, changePassword, verifyAccessToken };
