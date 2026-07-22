// backend/src/services/admin.service.js
const vendorRepo = require('../repositories/vendor.repository');
const ticketRepo = require('../repositories/ticket.repository');
const penaltyRepo = require('../repositories/penalty.repository');
const { currentMonthKey } = require('../utils/slaCalculator.util');

async function getOverview() {
  const vendors = await vendorRepo.findAll();
  const openTickets = await ticketRepo.findOpen();

  const activeVendors = vendors.filter((v) => v.status === 'active').length;
  const breaches = openTickets.filter((t) => t.slaStatus === 'breach').length;

  return {
    totalVendors: vendors.length,
    activeVendors,
    openTickets: openTickets.length,
    slaBreaches: breaches,
  };
}

async function getLeaderboard(month) {
  const targetMonth = month || currentMonthKey();
  const rows = await penaltyRepo.leaderboardByMonth(targetMonth);
  const vendors = await vendorRepo.findAll();
  const vendorMap = new Map(vendors.map((v) => [String(v._id), v]));

  return rows.map((r) => ({
    vendorId: r._id,
    vendorName: vendorMap.get(String(r._id))?.name || 'Unknown',
    shortCode: vendorMap.get(String(r._id))?.shortCode || '',
    totalPenalty: r.total,
    penaltyCount: r.count,
  }));
}

module.exports = { getOverview, getLeaderboard };
