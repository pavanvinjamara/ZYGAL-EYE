// backend/src/controllers/mis.controller.js
const misService = require('../services/mis.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function upload(req, res) {
  try {
    const result = await misService.uploadMis(req.body, req.file);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function list(req, res) {
  try {
    return ok(res, await misService.listUploads(req.params.vendorId, req.query.type));
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { upload, list };
