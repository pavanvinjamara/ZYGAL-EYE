// backend/src/repositories/audit.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const log = ({ userId, action, targetType, targetId, metadata, ip }) => getDB().collection(COL.AUDIT_LOGS).insertOne({
  userId: new ObjectId(userId),
  action,
  targetType: targetType || null,
  targetId: targetId || null,
  metadata: metadata || {},
  ip: ip || '',
  createdAt: new Date(),
});

const findByUser = (userId, limit = 50) => getDB().collection(COL.AUDIT_LOGS)
  .find({ userId: new ObjectId(userId) })
  .sort({ createdAt: -1 })
  .limit(limit)
  .toArray();

const findRecent = (limit = 100) => getDB().collection(COL.AUDIT_LOGS)
  .find({})
  .sort({ createdAt: -1 })
  .limit(limit)
  .toArray();

module.exports = { log, findByUser, findRecent };
