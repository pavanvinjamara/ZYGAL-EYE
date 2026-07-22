// backend/src/repositories/vendor.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findAll = (filter = {}) => getDB().collection(COL.VENDORS).find(filter).toArray();

const findById = (id) => getDB().collection(COL.VENDORS).findOne({ _id: new ObjectId(id) });

const findByShortCode = (shortCode) => getDB().collection(COL.VENDORS).findOne({ shortCode });

// Used to catch duplicate vendor registrations that share contact details
// (email/phone) even when the shortCode differs.
const findByContactEmailOrPhone = (email, phone) => {
  const or = [];
  if (email) or.push({ 'iiflContact.email': email.toLowerCase() });
  if (phone) or.push({ 'iiflContact.phone': phone });
  if (!or.length) return Promise.resolve(null);
  return getDB().collection(COL.VENDORS).findOne({ $or: or });
};

const create = (vendor) => {
  const doc = { ...vendor, status: vendor.status || 'onboarding', createdAt: new Date(), updatedAt: new Date() };
  return getDB().collection(COL.VENDORS).insertOne(doc);
};

const update = (id, patch) => getDB().collection(COL.VENDORS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { ...patch, updatedAt: new Date() } }
);

const activate = (id) => getDB().collection(COL.VENDORS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status: 'active', updatedAt: new Date() } }
);

const suspend = (id) => getDB().collection(COL.VENDORS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status: 'suspended', updatedAt: new Date() } }
);

module.exports = { findAll, findById, findByShortCode, findByContactEmailOrPhone, create, update, activate, suspend };
