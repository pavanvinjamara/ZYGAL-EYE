// backend/src/middleware/error.middleware.js
const logger = require('../utils/logger.util');
const { fail } = require('../utils/apiResponse.util');

// Catches multer errors, JSON parse errors, and anything thrown/next(err)'d downstream.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'MulterError') {
    return fail(res, { statusCode: 400, message: `Upload error: ${err.message}` });
  }

  if (err.type === 'entity.parse.failed') {
    return fail(res, { statusCode: 400, message: 'Invalid JSON body' });
  }

  const status = err.statusCode || 500;
  if (status >= 500) {
    logger.error(err.stack || err.message);
  }

  return fail(res, err);
}

function notFoundHandler(req, res) {
  return fail(res, { statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFoundHandler };
