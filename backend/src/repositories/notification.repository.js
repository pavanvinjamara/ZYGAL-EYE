// backend/src/repositories/notification.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const create = ({ userId, title, body, type, linkRef }) => getDB().collection(COL.NOTIFICATIONS).insertOne({
  userId: new ObjectId(userId),
  title,
  body: body || '',
  type,
  linkRef: linkRef || '',
  read: false,
  createdAt: new Date(),
});

const findByUser = (userId, { unreadOnly = false, limit = 50 } = {}) => {
  const q = { userId: new ObjectId(userId) };
  if (unreadOnly) q.read = false;
  return getDB().collection(COL.NOTIFICATIONS)
    .find(q)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
};

const markRead = (id) => getDB().collection(COL.NOTIFICATIONS).updateOne(
  { _id: new ObjectId(id) },
  { $set: { read: true } }
);

const markAllRead = (userId) => getDB().collection(COL.NOTIFICATIONS).updateMany(
  { userId: new ObjectId(userId), read: false },
  { $set: { read: true } }
);

module.exports = { create, findByUser, markRead, markAllRead };
