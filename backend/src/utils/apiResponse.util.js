// backend/src/utils/apiResponse.util.js

function ok(res, data, status = 200, meta = undefined) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

function created(res, data) {
  return ok(res, data, 201);
}

function noContent(res) {
  return res.status(204).send();
}

function fail(res, err) {
  const status = err.statusCode || 500;
  const message = err.message || 'Server error';
  const body = { success: false, message };
  if (err.details) body.details = err.details;
  return res.status(status).json(body);
}

module.exports = { ok, created, noContent, fail };
