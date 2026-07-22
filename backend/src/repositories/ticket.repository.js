// backend/src/repositories/ticket.repository.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const COL = require('../db/collections');

const findByVendor = (vendorId, filter = {}) => getDB().collection(COL.TICKETS)
  .find({ vendorId: new ObjectId(vendorId), ...filter })
  .sort({ openedAt: -1 })
  .toArray();

const findByRef = (ticketRef) => getDB().collection(COL.TICKETS).findOne({ ticketRef });

const findOpen = () => getDB().collection(COL.TICKETS).find({ status: { $ne: 'resolved' } }).toArray();

const create = (ticket) => {
  const doc = {
    ...ticket,
    timeline: ticket.timeline || [{ type: 'open', text: 'Ticket created', at: new Date(), byUserId: null }],
    closureReport: null,
    slaStatus: ticket.slaStatus || 'ok',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return getDB().collection(COL.TICKETS).insertOne(doc);
};

const addTimelineEntry = (ticketRef, entry) => getDB().collection(COL.TICKETS).updateOne(
  { ticketRef },
  { $push: { timeline: { ...entry, at: entry.at || new Date() } }, $set: { updatedAt: new Date() } }
);

const updateStatus = (ticketRef, status) => getDB().collection(COL.TICKETS).updateOne(
  { ticketRef },
  { $set: { status, updatedAt: new Date() } }
);

const updateSlaStatus = (ticketId, slaStatus) => getDB().collection(COL.TICKETS).updateOne(
  { _id: new ObjectId(ticketId) },
  { $set: { slaStatus, updatedAt: new Date() } }
);

const resolve = (ticketRef, closureReport) => getDB().collection(COL.TICKETS).updateOne(
  { ticketRef },
  {
    $set: { status: 'resolved', resolvedAt: new Date(), closureReport, updatedAt: new Date() },
    $push: { timeline: { type: 'done', text: 'Ticket resolved', at: new Date(), byUserId: null } },
  }
);

module.exports = {
  findByVendor, findByRef, findOpen, create,
  addTimelineEntry, updateStatus, updateSlaStatus, resolve,
};
