// backend/src/controllers/sla.controller.js
const slaService = require('../services/sla.service');
const { ok, fail } = require('../utils/apiResponse.util');

async function summary(req, res) {
  try {
    return ok(res, await slaService.getSummary(req.params.vendorId));
  } catch (err) {
    return fail(res, err);
  }
}

async function breaches(req, res) {
  try {
    return ok(res, await slaService.getBreaches(req.params.vendorId));
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { summary, breaches };
