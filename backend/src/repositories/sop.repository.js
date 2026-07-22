// backend/src/repositories/sop.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

// --- SOP violations ---
const findViolations = (vendorId, filter = {}) => getDB().collection(COL.SOP_VIOLATIONS)
  .find({ vendorId: new ObjectId(vendorId), ...filter })
  .sort({ occurredAt: -1 })
  .toArray();

const createViolation = (v) => getDB().collection(COL.SOP_VIOLATIONS).insertOne({
  ...v,
  occurredAt: v.occurredAt || new Date(),
});

const updateViolationStatus = (id, status) => getDB().collection(COL.SOP_VIOLATIONS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status } }
);

// --- OTP logs ---
const findOtpLogs = (vendorId, dateFrom) => {
  const q = { vendorId: new ObjectId(vendorId) };
  if (dateFrom) q.issuedAt = { $gte: dateFrom };
  return getDB().collection(COL.OTP_LOGS).find(q).sort({ issuedAt: -1 }).toArray();
};

const logOtp = (entry) => getDB().collection(COL.OTP_LOGS).insertOne({
  ...entry,
  issuedAt: entry.issuedAt || new Date(),
});

const countByStatus = (vendorId, status) => getDB().collection(COL.OTP_LOGS).countDocuments({
  vendorId: new ObjectId(vendorId),
  status,
});

module.exports = {
  findViolations, createViolation, updateViolationStatus,
  findOtpLogs, logOtp, countByStatus,
};
