// backend/src/controllers/admin.controller.js
const adminService = require('../services/admin.service');
const { ok, fail } = require('../utils/apiResponse.util');

async function overview(req, res) {
  try {
    return ok(res, await adminService.getOverview());
  } catch (err) {
    return fail(res, err);
  }
}

async function leaderboard(req, res) {
  try {
    return ok(res, await adminService.getLeaderboard(req.query.month));
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { overview, leaderboard };
