// backend/src/controllers/user.controller.js
const userService = require('../services/user.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    const filter = {};
    if (req.query.vendorId) filter.vendorId = req.query.vendorId;
    if (req.query.role) filter.role = req.query.role;
    return ok(res, await userService.listUsers(filter));
  } catch (err) {
    return fail(res, err);
  }
}

async function listByVendor(req, res) {
  try {
    return ok(res, await userService.listByVendor(req.params.vendorId));
  } catch (err) {
    return fail(res, err);
  }
}

async function invite(req, res) {
  try {
    const result = await userService.inviteUser(req.body, req.user.sub, { ip: req.ip });
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function updateStatus(req, res) {
  try {
    await userService.updateStatus(req.params.id, req.body.status, req.user.sub, { ip: req.ip });
    return ok(res, { message: 'User status updated' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, listByVendor, invite, updateStatus };
