// backend/src/controllers/ble.controller.js
const bleService = require('../services/ble.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    return ok(res, await bleService.listByVendor(req.params.vendorId, req.query.status));
  } catch (err) {
    return fail(res, err);
  }
}

// Cross-vendor view for the admin BLE map
async function listAll(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    return ok(res, await bleService.listAll(filter));
  } catch (err) {
    return fail(res, err);
  }
}

async function register(req, res) {
  try {
    const result = await bleService.registerAsset(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

// Called by the BLE gateway/edge device on each beacon ping
async function ping(req, res) {
  try {
    const { lat, lng } = req.body;
    await bleService.ping(req.params.assetTag, { lat, lng });
    return ok(res, { message: 'Ping recorded' });
  } catch (err) {
    return fail(res, err);
  }
}

async function setStatus(req, res) {
  try {
    await bleService.setStatus(req.params.assetTag, req.body.status);
    return ok(res, { message: 'Status updated' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, listAll, register, ping, setStatus };
