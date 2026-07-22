// backend/src/jobs/footageOverdueCheck.job.js
const footageRepo = require('../repositories/footage.repository');
const logger = require('../utils/logger.util');

async function runFootageOverdueCheck() {
  const result = await footageRepo.markOverdueIfPastDue();
  if (result.modifiedCount) {
    logger.warn(`[footageOverdueCheck] marked ${result.modifiedCount} footage request(s) overdue`);
  }
}

module.exports = { runFootageOverdueCheck };
