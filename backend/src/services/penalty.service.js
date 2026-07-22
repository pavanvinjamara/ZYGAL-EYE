// backend/src/services/penalty.service.js
const penaltyRepo = require('../repositories/penalty.repository');
const { currentMonthKey } = require('../utils/slaCalculator.util');

async function listPenalties(vendorId, month) {
  return penaltyRepo.findByVendor(vendorId, month);
}

async function getMonthlySummary(vendorId, month) {
  const targetMonth = month || currentMonthKey();
  const [summary] = await penaltyRepo.sumByVendorMonth(vendorId, targetMonth);
  return summary || { total: 0, count: 0, month: targetMonth };
}

async function disputePenalty(id, reason) {
  await penaltyRepo.dispute(id, reason);
}

async function waivePenalty(id) {
  await penaltyRepo.waive(id);
}

module.exports = { listPenalties, getMonthlySummary, disputePenalty, waivePenalty };
