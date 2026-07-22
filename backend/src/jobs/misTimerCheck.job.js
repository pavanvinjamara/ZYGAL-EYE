// backend/src/jobs/misTimerCheck.job.js
const { getDB } = require('../config/db');
const COL = require('../db/collections');
const { env } = require('../config/env');
const logger = require('../utils/logger.util');

async function runMisTimerCheck() {
  const db = getDB();
  const vendors = await db.collection(COL.VENDORS).find({ status: 'active' }).toArray();
  const windowMinutes = env.MIS_WINDOW_MINUTES;
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);

  for (const v of vendors) {
    const vendorWindow = v.misFrequencyMinutes || windowMinutes;
    const vendorSince = new Date(Date.now() - vendorWindow * 60 * 1000);

    const recent = await db.collection(COL.MIS_UPLOADS).findOne({
      vendorId: v._id,
      uploadedAt: { $gte: vendorSince },
    });

    if (!recent) {
      await db.collection(COL.BRANCHES).updateMany(
        { vendorId: v._id }, { $set: { nvrStatus: 'OFFLINE' } }
      );
      logger.warn(`[misTimerCheck] MIS window missed for vendor ${v.shortCode}`);
    }
  }
}

module.exports = { runMisTimerCheck };
