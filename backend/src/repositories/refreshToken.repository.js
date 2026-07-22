// backend/src/repositories/refreshToken.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const create = ({ userId, token, userAgent, ip, expiresAt }) => getDB().collection(COL.REFRESH_TOKENS).insertOne({
  userId: new ObjectId(userId),
  token,
  userAgent: userAgent || '',
  ip: ip || '',
  revoked: false,
  expiresAt,
  createdAt: new Date(),
});

const findByToken = (token) => getDB().collection(COL.REFRESH_TOKENS).findOne({ token, revoked: false });

const revoke = (token) => getDB().collection(COL.REFRESH_TOKENS).updateOne(
  { token },
  { $set: { revoked: true } }
);

const revokeAllForUser = (userId) => getDB().collection(COL.REFRESH_TOKENS).updateMany(
  { userId: new ObjectId(userId) },
  { $set: { revoked: true } }
);

module.exports = { create, findByToken, revoke, revokeAllForUser };
