// backend/src/services/ble.service.js
const bleRepo = require('../repositories/ble.repository');

async function listByVendor(vendorId, status) {
  return bleRepo.findByVendor(vendorId, status);
}

async function listAll(filter = {}) {
  return bleRepo.findAll(filter);
}

async function registerAsset(data) {
  const existing = await bleRepo.findByTag(data.assetTag);
  if (existing) throw Object.assign(new Error('Asset tag already registered'), { statusCode: 409 });

  const result = await bleRepo.create({ ...data, status: 'ok', location: { lat: 0, lng: 0 } });
  return { _id: result.insertedId };
}

async function ping(assetTag, location) {
  await bleRepo.upsertPing(assetTag, location);
}

async function setStatus(assetTag, status) {
  await bleRepo.setStatus(assetTag, status);
}

module.exports = { listByVendor, listAll, registerAsset, ping, setStatus };
