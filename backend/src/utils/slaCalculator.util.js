// backend/src/utils/slaCalculator.util.js

const TARGETS = { P1: 4, P2: 8, P3: 24 };            // hours
const PENALTY_RATE = { P1: 3000, P2: 1500, P3: 500 }; // ₹ per hour of overage

function slaTargetHours(priority) {
  return TARGETS[priority] || 24;
}

/**
 * Determine current SLA status for a ticket.
 * @param {Date|string} openedAt
 * @param {'P1'|'P2'|'P3'} priority
 * @param {Date|null} resolvedAt - pass null for still-open tickets
 */
function computeSlaStatus(openedAt, priority, resolvedAt = null) {
  const target = slaTargetHours(priority);
  const elapsedHrs = ((resolvedAt || new Date()) - new Date(openedAt)) / 3.6e6;
  if (elapsedHrs > target) return 'breach';
  if (elapsedHrs > target * 0.75) return 'warn';
  return 'ok';
}

function computePenalty(priority, overageHours) {
  const rate = PENALTY_RATE[priority] || 500;
  return Math.max(0, Math.ceil(overageHours)) * rate;
}

function currentMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7); // "YYYY-MM"
}

module.exports = {
  TARGETS,
  PENALTY_RATE,
  slaTargetHours,
  computeSlaStatus,
  computePenalty,
  currentMonthKey,
};
