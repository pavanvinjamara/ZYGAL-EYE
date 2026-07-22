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

async function authenticateCredentials(email, password) {
  const user = await userRepo.findByEmail(email);
  if (!user || user.status !== 'active') {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }
  const matches = await comparePassword(password, user.passwordHash);
  if (!matches) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }
  return user;
}

async function issueSession(user, meta = {}) {
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

// ---- Vendor portal login: /auth/vendor/login ----
// Only accounts with a vendorId may authenticate here, and the vendorShortCode
// they select must match that account's actual vendor. An internal/admin
// account (vendorId === null) is rejected outright, no matter what shortCode
// was submitted -- there is no shortCode that can make an admin "become" a vendor.
async function loginVendor({ email, password, vendorShortCode }, meta = {}) {
  const user = await authenticateCredentials(email, password);

  if (!user.vendorId) {
    throw Object.assign(
      new Error('This account is not a vendor account. Please use the Admin Portal to sign in.'),
      { statusCode: 403 }
    );
  }

  const vendor = await vendorRepo.findByShortCode(vendorShortCode);
  if (!vendor || String(vendor._id) !== String(user.vendorId)) {
    throw Object.assign(new Error('Vendor mismatch. Please select the correct company.'), { statusCode: 401 });
  }

  return issueSession(user, meta);
}

// ---- Admin/IIFL SOC login: /auth/admin/login ----
// Only internal accounts (vendorId === null AND role === 'iifl_soc') may
// authenticate here -- mirrors the requireInternal + requireRole('iifl_soc')
// check already enforced on /admin/* routes. A vendor account is rejected
// outright, even if it happens to carry role: 'admin' (vendor-scoped admin
// is a different thing from platform admin -- see the earlier bug fix).
async function loginAdmin({ email, password }, meta = {}) {
  const user = await authenticateCredentials(email, password);

  if (user.vendorId || user.role !== 'iifl_soc') {
    throw Object.assign(
      new Error('This account does not have admin access. Please use the Vendor Portal to sign in.'),
      { statusCode: 403 }
    );
  }

  return issueSession(user, meta);
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

module.exports = {
  loginVendor, loginAdmin, refresh, logout, getMe, register, changePassword, verifyAccessToken,
};