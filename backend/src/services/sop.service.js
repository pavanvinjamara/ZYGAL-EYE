// backend/src/services/sop.service.js
const sopRepo = require('../repositories/sop.repository');

function generateViolationRef(branchCode) {
  const segment = (branchCode || '').split('-')[1] || 'GEN';
  return `SOP-${segment}-${Math.floor(100 + Math.random() * 899)}`;
}

async function listViolations(vendorId, filter = {}) {
  return sopRepo.findViolations(vendorId, filter);
}

async function createViolation(data) {
  const violationRef = generateViolationRef(data.branchCode);
  const result = await sopRepo.createViolation({ ...data, violationRef, status: 'open' });
  return { _id: result.insertedId, violationRef };
}

async function updateViolationStatus(id, status) {
  await sopRepo.updateViolationStatus(id, status);
}

// Determines compliance status from the 7-point checklist, logs the access
// event, and auto-raises a violation record when the checklist is incomplete.
async function issueOtp(data) {
  const { checklist } = data;
  const allChecked = Object.values(checklist).every(Boolean);
  const status = allChecked ? 'compliant' : 'violation';

  const result = await sopRepo.logOtp({ ...data, status });

  if (!allChecked) {
    const failedSteps = Object.entries(checklist).filter(([, v]) => !v).map(([k]) => k);
    await createViolation({
      vendorId: data.vendorId,
      branchCode: data.branchCode,
      operator: data.operator,
      type: 'OTP checklist incomplete',
      severity: 'high',
      penaltyAmount: 0,
      detail: `Missed steps: ${failedSteps.join(', ')}`,
    });
  }

  return { _id: result.insertedId, status };
}

async function listOtpLogs(vendorId, since) {
  return sopRepo.findOtpLogs(vendorId, since);
}

module.exports = { listViolations, createViolation, updateViolationStatus, issueOtp, listOtpLogs };
