const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { COLLECTION_NAME, refreshTokenJsonSchema } = require('../models/refreshToken.model');

function collection() {
  return getDB().collection(COLLECTION_NAME);
}

async function ensureIndexes() {
  const db = getDB();
  const existing = await db.listCollections({ name: COLLECTION_NAME }).toArray();

  if (existing.length === 0) {
    await db.createCollection(COLLECTION_NAME, { validator: refreshTokenJsonSchema });
  } else {
    await db.command({ collMod: COLLECTION_NAME, validator: refreshTokenJsonSchema });
  }

  await collection().createIndex({ userId: 1 });
  // TTL index — MongoDB auto-deletes the doc once expiresAt passes
  await collection().createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

async function create({ userId, tokenHash, userAgent, ip, expiresAt }) {
  const doc = {
    userId: new ObjectId(userId),
    tokenHash,
    userAgent: userAgent || null,
    ip: ip || null,
    expiresAt,
    revoked: false,
    createdAt: new Date(),
  };
  const { insertedId } = await collection().insertOne(doc);
  return { _id: insertedId, ...doc };
}

async function findValidByHash(tokenHash) {
  return collection().findOne({
    tokenHash,
    revoked: false,
    expiresAt: { $gt: new Date() },
  });
}

async function revokeByHash(tokenHash) {
  await collection().updateOne({ tokenHash }, { $set: { revoked: true } });
}

async function revokeAllForUser(userId) {
  await collection().updateMany(
    { userId: new ObjectId(userId) },
    { $set: { revoked: true } }
  );
}

module.exports = {
  ensureIndexes,
  create,
  findValidByHash,
  revokeByHash,
  revokeAllForUser,
};