// backend/src/services/vendor.service.js
const vendorRepo = require('../repositories/vendor.repository');
const branchRepo = require('../repositories/branch.repository');
const auditRepo = require('../repositories/audit.repository');

async function listVendors() {
  return vendorRepo.findAll();
}

async function getVendor(id) {
  const vendor = await vendorRepo.findById(id);
  if (!vendor) throw Object.assign(new Error('Vendor not found'), { statusCode: 404 });
  return vendor;
}

async function getVendorBranches(id) {
  return branchRepo.findByVendor(id);
}

async function createVendor(data) {
  const existingCode = await vendorRepo.findByShortCode(data.shortCode);
  if (existingCode) throw Object.assign(new Error('Vendor short code already exists'), { statusCode: 409 });

  const existingContact = await vendorRepo.findByContactEmailOrPhone(
    data.iiflContact?.email,
    data.iiflContact?.phone
  );
  if (existingContact) {
    throw Object.assign(
      new Error(`A vendor already exists with this contact email/phone (${existingContact.name}, ${existingContact.shortCode})`),
      { statusCode: 409 }
    );
  }

  try {
    const result = await vendorRepo.create(data);
    return { _id: result.insertedId };
  } catch (err) {
    // Fallback for the rare race condition where two requests pass the
    // check above at the same time -- the unique index catches it here.
    if (err.code === 11000) {
      throw Object.assign(new Error('A vendor with this short code or contact email already exists'), { statusCode: 409 });
    }
    throw err;
  }
}

async function updateVendor(id, patch) {
  await vendorRepo.update(id, patch);
}

async function activateVendor(id, actorUserId, meta = {}) {
  await vendorRepo.activate(id);
  await auditRepo.log({
    userId: actorUserId, action: 'vendor.activate',
    targetType: 'vendor', targetId: id, ip: meta.ip,
  });
}

async function suspendVendor(id, actorUserId, meta = {}) {
  await vendorRepo.suspend(id);
  await auditRepo.log({
    userId: actorUserId, action: 'vendor.suspend',
    targetType: 'vendor', targetId: id, ip: meta.ip,
  });
}

module.exports = {
  listVendors, getVendor, getVendorBranches,
  createVendor, updateVendor, activateVendor, suspendVendor,
};
