// backend/src/controllers/penalty.controller.js
const penaltyService = require('../services/penalty.service');
const { ok, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    return ok(res, await penaltyService.listPenalties(req.params.vendorId, req.query.month));
  } catch (err) {
    return fail(res, err);
  }
}

async function monthlySummary(req, res) {
  try {
    return ok(res, await penaltyService.getMonthlySummary(req.params.vendorId, req.query.month));
  } catch (err) {
    return fail(res, err);
  }
}

async function dispute(req, res) {
  try {
    await penaltyService.disputePenalty(req.params.id, req.body.reason);
    return ok(res, { message: 'Dispute filed' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, monthlySummary, dispute };
