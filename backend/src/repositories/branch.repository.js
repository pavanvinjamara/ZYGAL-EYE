// backend/src/repositories/branch.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findByVendor = (vendorId) => getDB().collection(COL.BRANCHES)
  .find({ vendorId: new ObjectId(vendorId) }).toArray();

const findByCode = (branchCode) => getDB().collection(COL.BRANCHES).findOne({ branchCode });

const create = (branch) => getDB().collection(COL.BRANCHES).insertOne(branch);

const updateStatus = (branchCode, patch) => getDB().collection(COL.BRANCHES).updateOne(
  { branchCode },
  { $set: { ...patch, lastSeenAt: new Date() } }
);

const setAllOfflineForVendor = (vendorId) => getDB().collection(COL.BRANCHES).updateMany(
  { vendorId: new ObjectId(vendorId) },
  { $set: { nvrStatus: 'OFFLINE' } }
);

module.exports = { findByVendor, findByCode, create, updateStatus, setAllOfflineForVendor };
