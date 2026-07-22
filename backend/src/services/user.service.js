// backend/src/services/user.service.js
const crypto = require('crypto');
const userRepo = require('../repositories/user.repository');
const auditRepo = require('../repositories/audit.repository');
const { hashPassword } = require('../utils/password.util');

function stripPasswords(users) {
  return users.map(({ passwordHash, ...u }) => u);
}

async function listUsers(filter = {}) {
  const users = await userRepo.findAll(filter);
  return stripPasswords(users);
}

async function listByVendor(vendorId) {
  const users = await userRepo.findByVendor(vendorId);
  return stripPasswords(users);
}

// Admin invites a user with a temporary random password (would normally be emailed)
async function inviteUser(data, actorUserId, meta = {}) {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw Object.assign(new Error('Email already in use'), { statusCode: 409 });

  const tempPassword = crypto.randomBytes(6).toString('hex');
  const passwordHash = await hashPassword(tempPassword);

  const result = await userRepo.create({ ...data, passwordHash, status: 'invited' });

  await auditRepo.log({
    userId: actorUserId, action: 'user.invite',
    targetType: 'user', targetId: String(result.insertedId), ip: meta.ip,
  });

  // In production this would be emailed, not returned in the API response
  return { _id: result.insertedId, tempPassword };
}

async function updateStatus(id, status, actorUserId, meta = {}) {
  await userRepo.setStatus(id, status);
  await auditRepo.log({
    userId: actorUserId, action: 'user.updateStatus',
    targetType: 'user', targetId: id, metadata: { status }, ip: meta.ip,
  });
}

module.exports = { listUsers, listByVendor, inviteUser, updateStatus };
