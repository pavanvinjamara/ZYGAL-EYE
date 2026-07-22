// backend/src/controllers/vendor.controller.js
const vendorService = require('../services/vendor.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    return ok(res, await vendorService.listVendors());
  } catch (err) {
    return fail(res, err);
  }
}

async function get(req, res) {
  try {
    return ok(res, await vendorService.getVendor(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
}

async function getBranches(req, res) {
  try {
    return ok(res, await vendorService.getVendorBranches(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
}

async function create(req, res) {
  try {
    const result = await vendorService.createVendor(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function update(req, res) {
  try {
    await vendorService.updateVendor(req.params.id, req.body);
    return ok(res, { message: 'Vendor updated' });
  } catch (err) {
    return fail(res, err);
  }
}

async function activate(req, res) {
  try {
    await vendorService.activateVendor(req.params.id, req.user.sub, { ip: req.ip });
    return ok(res, { message: 'Vendor activated' });
  } catch (err) {
    return fail(res, err);
  }
}

async function suspend(req, res) {
  try {
    await vendorService.suspendVendor(req.params.id, req.user.sub, { ip: req.ip });
    return ok(res, { message: 'Vendor suspended' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, get, getBranches, create, update, activate, suspend };
