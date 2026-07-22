// backend/src/services/sla.service.js
const ticketRepo = require('../repositories/ticket.repository');

function pctCompliant(tickets) {
  if (!tickets.length) return 100;
  const okCount = tickets.filter((t) => t.slaStatus !== 'breach').length;
  return +((okCount / tickets.length) * 100).toFixed(1);
}

async function getSummary(vendorId) {
  const tickets = await ticketRepo.findByVendor(vendorId);
  const byPriority = { P1: [], P2: [], P3: [] };
  tickets.forEach((t) => byPriority[t.priority]?.push(t));

  return {
    P1: pctCompliant(byPriority.P1),
    P2: pctCompliant(byPriority.P2),
    P3: pctCompliant(byPriority.P3),
    overall: pctCompliant(tickets),
    breaches: tickets.filter((t) => t.slaStatus === 'breach').length,
    warnings: tickets.filter((t) => t.slaStatus === 'warn').length,
    totalTickets: tickets.length,
  };
}

async function getBreaches(vendorId) {
  return ticketRepo.findByVendor(vendorId, { slaStatus: 'breach' });
}

module.exports = { getSummary, getBreaches };
