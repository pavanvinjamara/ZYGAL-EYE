// backend/src/jobs/slaBreachCheck.job.js
const { getDB } = require('../config/db');
const COL = require('../db/collections');
const { computeSlaStatus, computePenalty, slaTargetHours, currentMonthKey } = require('../utils/slaCalculator.util');
const logger = require('../utils/logger.util');

async function runSlaBreachCheck() {
  const db = getDB();
  const openTickets = await db.collection(COL.TICKETS)
    .find({ status: { $ne: 'resolved' } }).toArray();

  for (const t of openTickets) {
    const newStatus = computeSlaStatus(t.openedAt, t.priority);

    if (newStatus !== t.slaStatus) {
      await db.collection(COL.TICKETS).updateOne(
        { _id: t._id }, { $set: { slaStatus: newStatus, updatedAt: new Date() } }
      );
    }

    if (newStatus === 'breach') {
      const target = slaTargetHours(t.priority);
      const overage = (Date.now() - new Date(t.openedAt)) / 3.6e6 - target;
      const amount = computePenalty(t.priority, overage);
      const month = currentMonthKey();

      const existing = await db.collection(COL.PENALTIES).findOne({ ticketRef: t.ticketRef, month });
      if (!existing) {
        await db.collection(COL.PENALTIES).insertOne({
          vendorId: t.vendorId,
          ticketRef: t.ticketRef,
          description: `${t.priority} overage on ${t.branchCode}`,
          ruleApplied: `${t.priority} overage penalty`,
          amount,
          incidentDate: new Date(),
          status: 'charged',
          month,
        });
      }
    }
  }

  logger.info(`[slaBreachCheck] scanned ${openTickets.length} open tickets`);
}

module.exports = { runSlaBreachCheck };
