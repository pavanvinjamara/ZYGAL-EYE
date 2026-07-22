// backend/src/middleware/auth.middleware.js
const { verifyAccessToken } = require('../utils/jwt.util');
const { fail } = require('../utils/apiResponse.util');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return fail(res, { statusCode: 401, message: 'Missing token' });
  }

  try {
    const payload = verifyAccessToken(token); // { sub, role, vendorId }
    req.user = payload;
    return next();
  } catch (err) {
    return fail(res, { statusCode: 401, message: 'Invalid or expired token' });
  }
}

// Attaches req.user if a valid token is present, but never rejects the request.
function optionalAuthenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    req.user = verifyAccessToken(token);
  } catch (err) {
    // ignore invalid token for optional auth
  }
  return next();
}

module.exports = { authenticate, optionalAuthenticate };
