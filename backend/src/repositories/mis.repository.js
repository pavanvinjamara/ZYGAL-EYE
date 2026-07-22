// backend/src/repositories/mis.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const create = (upload) => getDB().collection(COL.MIS_UPLOADS).insertOne({
  ...upload,
  uploadedAt: upload.uploadedAt || new Date(),
});

const findByVendor = (vendorId, type) => {
  const q = { vendorId: new ObjectId(vendorId) };
  if (type) q.type = type;
  return getDB().collection(COL.MIS_UPLOADS).find(q).sort({ uploadedAt: -1 }).toArray();
};

const latestForWindow = (vendorId, type, since) => getDB().collection(COL.MIS_UPLOADS).findOne(
  { vendorId: new ObjectId(vendorId), type, uploadedAt: { $gte: since } },
  { sort: { uploadedAt: -1 } }
);

const missedCountByVendor = (vendorId) => getDB().collection(COL.MIS_UPLOADS).countDocuments({
  vendorId: new ObjectId(vendorId),
  onTime: false,
});

module.exports = { create, findByVendor, latestForWindow, missedCountByVendor };
