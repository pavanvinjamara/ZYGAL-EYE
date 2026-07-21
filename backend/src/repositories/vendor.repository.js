const { getDB } = require('../config/db');
const { COLLECTION_NAME, vendorJsonSchema } = require('../models/vendor.model');

function collection() {
  return getDB().collection(COLLECTION_NAME);
}

async function ensureIndexes() {
  const db = getDB();
  const existing = await db.listCollections({ name: COLLECTION_NAME }).toArray();

  if (existing.length === 0) {
    await db.createCollection(COLLECTION_NAME, { validator: vendorJsonSchema });
  } else {
    await db.command({ collMod: COLLECTION_NAME, validator: vendorJsonSchema });
  }

  await collection().createIndex({ code: 1 }, { unique: true });
}

async function findByCode(code) {
  return collection().findOne({ code, status: 'active' });
}

async function findById(id) {
  const { ObjectId } = require('mongodb');
  return collection().findOne({ _id: new ObjectId(id) });
}
// add this function to your existing vendor.repository.js

async function findAllActivePublic() {
  return collection()
    .find(
      { status: 'active' },
      { projection: { code: 1, name: 1, shortCode: 1, _id: 0 } } // whitelist fields only
    )
    .sort({ name: 1 })
    .toArray();
}

module.exports = {
  ensureIndexes,
  findByCode,
  findById,
  findAllActivePublic, // add to exports
};