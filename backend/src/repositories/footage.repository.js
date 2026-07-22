// backend/src/repositories/footage.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const create = (req) => getDB().collection(COL.FOOTAGE_REQUESTS).insertOne({
  ...req,
  status: req.status || 'pending',
});

const findByVendor = (vendorId, type) => {
  const q = { vendorId: new ObjectId(vendorId) };
  if (type) q.type = type;
  return getDB().collection(COL.FOOTAGE_REQUESTS).find(q).sort({ dueDate: 1 }).toArray();
};

const findByRef = (requestRef) => getDB().collection(COL.FOOTAGE_REQUESTS).findOne({ requestRef });

const findAll = (filter = {}) => getDB().collection(COL.FOOTAGE_REQUESTS).find(filter).sort({ dueDate: 1 }).toArray();

const markUploaded = (requestRef, sharePointPath) => getDB().collection(COL.FOOTAGE_REQUESTS).updateOne(
  { requestRef },
  { $set: { status: 'uploaded', sharePointPath } }
);

const markOverdueIfPastDue = () => getDB().collection(COL.FOOTAGE_REQUESTS).updateMany(
  { status: 'pending', dueDate: { $lt: new Date() } },
  { $set: { status: 'overdue' } }
);

module.exports = { create, findByVendor, findByRef, findAll, markUploaded, markOverdueIfPastDue };
