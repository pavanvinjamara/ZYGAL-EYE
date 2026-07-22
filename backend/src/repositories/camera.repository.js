// backend/src/repositories/camera.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findByBranch = (branchCode) => getDB().collection(COL.CAMERAS).find({ branchCode }).toArray();

const findByVendor = (vendorId) => getDB().collection(COL.CAMERAS)
  .find({ vendorId: new ObjectId(vendorId) }).toArray();

const create = (camera) => getDB().collection(COL.CAMERAS).insertOne(camera);

const setStatus = (cameraCode, status) => getDB().collection(COL.CAMERAS).updateOne(
  { cameraCode },
  { $set: { status, lastPingAt: new Date() } }
);

module.exports = { findByBranch, findByVendor, create, setStatus };
