const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { COLLECTION_NAME, userJsonSchema } = require('../models/user.model');

function collection() {
  return getDB().collection(COLLECTION_NAME);
}

async function ensureIndexes() {
  const db = getDB();
  const existing = await db.listCollections({ name: COLLECTION_NAME }).toArray();

  if (existing.length === 0) {
    await db.createCollection(COLLECTION_NAME, { validator: userJsonSchema });
  } else {
    await db.command({ collMod: COLLECTION_NAME, validator: userJsonSchema });
  }

  await collection().createIndex({ email: 1 }, { unique: true });
  await collection().createIndex({ vendorId: 1 });
}

async function findByEmail(email) {
  return collection().findOne({ email: email.toLowerCase().trim() });
}

async function findById(id) {
  return collection().findOne({ _id: new ObjectId(id) });
}

async function createUser(userDoc) {
  const now = new Date();
  const doc = {
    ...userDoc,
    email: userDoc.email.toLowerCase().trim(),
    status: 'active',
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  };
  const { insertedId } = await collection().insertOne(doc);
  return { _id: insertedId, ...doc };
}

async function recordSuccessfulLogin(userId) {
  await collection().updateOne(
    { _id: new ObjectId(userId) },
    { $set: { lastLoginAt: new Date(), failedLoginAttempts: 0, lockedUntil: null } }
  );
}

async function recordFailedLogin(userId, { lockThreshold = 5, lockMinutes = 15 } = {}) {
  const user = await findById(userId);
  const attempts = (user.failedLoginAttempts || 0) + 1;
  const update = { failedLoginAttempts: attempts };

  if (attempts >= lockThreshold) {
    update.lockedUntil = new Date(Date.now() + lockMinutes * 60 * 1000);
  }

  await collection().updateOne({ _id: new ObjectId(userId) }, { $set: update });
}

module.exports = {
  ensureIndexes,
  findByEmail,
  findById,
  createUser,
  recordSuccessfulLogin,
  recordFailedLogin,
};