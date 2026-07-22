// backend/src/repositories/user.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findByEmail = (email) => getDB().collection(COL.USERS).findOne({ email: email.toLowerCase() });

const findById = (id) => getDB().collection(COL.USERS).findOne({ _id: new ObjectId(id) });

const findByVendor = (vendorId) => getDB().collection(COL.USERS)
  .find({ vendorId: new ObjectId(vendorId) }).toArray();

const findAll = (filter = {}) => getDB().collection(COL.USERS).find(filter).toArray();

const create = (user) => {
  const doc = {
    ...user,
    email: user.email.toLowerCase(),
    vendorId: user.vendorId ? new ObjectId(user.vendorId) : null,
    branchesAssigned: user.branchesAssigned || [],
    createdAt: new Date(),
    lastLoginAt: null,
  };
  return getDB().collection(COL.USERS).insertOne(doc);
};

const touchLogin = (id) => getDB().collection(COL.USERS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { lastLoginAt: new Date() } }
);

const setPasswordHash = (id, passwordHash) => getDB().collection(COL.USERS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { passwordHash } }
);

const setStatus = (id, status) => getDB().collection(COL.USERS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { status } }
);

const update = (id, patch) => getDB().collection(COL.USERS).updateOne(
  { _id: new ObjectId(id) },
  { $set: patch }
);

module.exports = {
  findByEmail, findById, findByVendor, findAll,
  create, touchLogin, setPasswordHash, setStatus, update,
};
