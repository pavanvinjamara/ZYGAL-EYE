const vendorRepo = require('../repositories/vendor.repository');

async function listPublicVendors() {
  const vendors = await vendorRepo.findAllActivePublic();
  return vendors.map(v => ({
    value: v.code,
    label: v.name,
    shortCode: v.shortCode || v.code.slice(0, 2).toUpperCase(),
  }));
}

module.exports = { listPublicVendors };