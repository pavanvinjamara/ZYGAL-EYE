// backend/src/controllers/sop.controller.js
const sopService = require('../services/sop.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function listViolations(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    return ok(res, await sopService.listViolations(req.params.vendorId, filter));
  } catch (err) {
    return fail(res, err);
  }
}

async function createViolation(req, res) {
  try {
    const result = await sopService.createViolation(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function updateViolationStatus(req, res) {
  try {
    await sopService.updateViolationStatus(req.params.id, req.body.status);
    return ok(res, { message: 'Violation status updated' });
  } catch (err) {
    return fail(res, err);
  }
}

async function issueOtp(req, res) {
  try {
    const result = await sopService.issueOtp(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function listOtpLogs(req, res) {
  try {
    const since = req.query.since ? new Date(req.query.since) : undefined;
    return ok(res, await sopService.listOtpLogs(req.params.vendorId, since));
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { listViolations, createViolation, updateViolationStatus, issueOtp, listOtpLogs };
