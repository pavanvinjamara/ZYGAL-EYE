// backend/src/repositories/penalty.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findByVendor = (vendorId, month) => {
  const q = { vendorId: new ObjectId(vendorId) };
  if (month) q.month = month;
  return getDB().collection(COL.PENALTIES).find(q).sort({ incidentDate: -1 }).toArray();
};

const findByTicketAndMonth = (ticketRef, month) => getDB().collection(COL.PENALTIES)
  .findOne({ ticketRef, month });

const create = (penalty) => getDB().collection(COL.PENALTIES).insertOne(penalty);

const dispute = (id, reason) => getDB().collection(COL.PENALTIES).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status: 'disputed', disputeReason: reason } }
);

const waive = (id) => getDB().collection(COL.PENALTIES).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status: 'waived' } }
);

const sumByVendorMonth = (vendorId, month) => getDB().collection(COL.PENALTIES).aggregate([
  { $match: { vendorId: new ObjectId(vendorId), month } },
  { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
]).toArray();

const leaderboardByMonth = (month) => getDB().collection(COL.PENALTIES).aggregate([
  { $match: { month } },
  { $group: { _id: '$vendorId', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  { $sort: { total: -1 } },
]).toArray();

module.exports = {
  findByVendor, findByTicketAndMonth, create, dispute, waive,
  sumByVendorMonth, leaderboardByMonth,
};
