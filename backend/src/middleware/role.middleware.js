// backend/src/middleware/role.middleware.js
const { fail } = require('../utils/apiResponse.util');

// Restrict a route to specific roles, e.g. requireRole('iifl_soc', 'admin')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, { statusCode: 403, message: 'Forbidden' });
    }
    return next();
  };
}

// IIFL internal staff only (vendorId is null on their user record)
function requireInternal(req, res, next) {
  if (!req.user || req.user.vendorId) {
    return fail(res, { statusCode: 403, message: 'IIFL internal access only' });
  }
  return next();
}

// Vendor users may only touch resources scoped to their own vendorId.
// Internal IIFL staff (vendorId is null on their user record) bypass this check.
function scopeToOwnVendor(req, res, next) {
  const requestedVendorId = req.params.vendorId || req.body.vendorId;
  const isInternal = !req.user.vendorId;

  if (!isInternal && requestedVendorId && requestedVendorId !== req.user.vendorId) {
    return fail(res, { statusCode: 403, message: 'Cross-vendor access denied' });
  }
  return next();
}

module.exports = { requireRole, requireInternal, scopeToOwnVendor };
