// backend/src/repositories/ble.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findByVendor = (vendorId, status) => {
  const q = { vendorId: new ObjectId(vendorId) };
  if (status) q.status = status;
  return getDB().collection(COL.BLE_ASSETS).find(q).toArray();
};

const findAll = (filter = {}) => getDB().collection(COL.BLE_ASSETS).find(filter).toArray();

const findByTag = (assetTag) => getDB().collection(COL.BLE_ASSETS).findOne({ assetTag });

const create = (asset) => getDB().collection(COL.BLE_ASSETS).insertOne({
  ...asset,
  lastPingAt: new Date(),
});

const upsertPing = (assetTag, location) => getDB().collection(COL.BLE_ASSETS).updateOne(
  { assetTag },
  { $set: { location, lastPingAt: new Date() } }
);

const setStatus = (assetTag, status) => getDB().collection(COL.BLE_ASSETS).updateOne(
  { assetTag },
  { $set: { status } }
);

module.exports = { findByVendor, findAll, findByTag, create, upsertPing, setStatus };
