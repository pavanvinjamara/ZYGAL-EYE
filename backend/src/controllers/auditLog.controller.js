// backend/src/controllers/auditLog.controller.js
const auditRepo = require('../repositories/audit.repository');
const { ok, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
    const logs = await auditRepo.findRecent(limit);
    return ok(res, logs);
  } catch (err) {
    return fail(res, err);
  }
}

async function listByUser(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const logs = await auditRepo.findByUser(req.params.userId, limit);
    return ok(res, logs);
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, listByUser };
