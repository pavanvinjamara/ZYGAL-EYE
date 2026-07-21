const vendorService = require('../services/vendor.service');

async function listPublicVendors(req, res, next) {
  try {
    const vendors = await vendorService.listPublicVendors();
    return res.status(200).json({ success: true, vendors });
  } catch (err) {
    next(err);
  }
}

module.exports = { listPublicVendors };