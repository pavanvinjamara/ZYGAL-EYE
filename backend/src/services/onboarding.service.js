// backend/src/services/onboarding.service.js
const vendorRepo = require('../repositories/vendor.repository');
const branchRepo = require('../repositories/branch.repository');
const auditRepo = require('../repositories/audit.repository');

// Step 1 — vendor core details, created in "onboarding" status
async function vendorDetailsStep(data) {
  const existing = await vendorRepo.findByShortCode(data.shortCode);
  if (existing) throw Object.assign(new Error('Vendor short code already exists'), { statusCode: 409 });

  const result = await vendorRepo.create({ ...data, status: 'onboarding' });
  return { vendorId: result.insertedId };
}

// Step 2 — IIFL point of contact for the vendor
async function contactStep({ vendorId, ...contact }) {
  const existingContact = await vendorRepo.findByContactEmailOrPhone(contact.email, contact.phone);
  if (existingContact && String(existingContact._id) !== String(vendorId)) {
    throw Object.assign(
      new Error(`A vendor already exists with this contact email/phone (${existingContact.name}, ${existingContact.shortCode})`),
      { statusCode: 409 }
    );
  }

  try {
    await vendorRepo.update(vendorId, { iiflContact: contact });
  } catch (err) {
    if (err.code === 11000) {
      throw Object.assign(new Error('A vendor with this contact email already exists'), { statusCode: 409 });
    }
    throw err;
  }
}

// Step 3 — bulk branch/site allocation
async function siteAllocationStep({ vendorId, branches }) {
  for (const b of branches) {
    await branchRepo.create({
      ...b,
      vendorId,
      camerasOnline: 0,
      nvrStatus: 'OFFLINE',
      networkUptimePct: 0,
      cloudBackupStatus: 'OK',
      lastSeenAt: new Date(),
    });
  }

  await vendorRepo.update(vendorId, { branchCount: branches.length });
  return { allocated: branches.length };
}

// Step 4 — review & activate
async function reviewActivateStep({ vendorId }, actorUserId, meta = {}) {
  await vendorRepo.activate(vendorId);
  await auditRepo.log({
    userId: actorUserId, action: 'vendor.onboarding.complete',
    targetType: 'vendor', targetId: vendorId, ip: meta.ip,
  });
}

module.exports = { vendorDetailsStep, contactStep, siteAllocationStep, reviewActivateStep };
