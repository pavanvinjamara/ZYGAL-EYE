// backend/src/controllers/footage.controller.js
const footageService = require('../services/footage.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    return ok(res, await footageService.listByVendor(req.params.vendorId, req.query.type));
  } catch (err) {
    return fail(res, err);
  }
}

// Admin-facing cross-vendor list
async function listAll(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    return ok(res, await footageService.listAll(filter));
  } catch (err) {
    return fail(res, err);
  }
}

async function create(req, res) {
  try {
    const result = await footageService.createRequest(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function markUploaded(req, res) {
  try {
    await footageService.markUploaded(req.params.requestRef);
    return ok(res, { message: 'Marked as uploaded' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, listAll, create, markUploaded };
