// backend/src/services/footage.service.js
const footageRepo = require('../repositories/footage.repository');
const vendorRepo = require('../repositories/vendor.repository');
const { buildSharepointPath } = require('../utils/sharepointPath.util');

function generateRequestRef() {
  return `FR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
}

async function listByVendor(vendorId, type) {
  return footageRepo.findByVendor(vendorId, type);
}

async function listAll(filter = {}) {
  return footageRepo.findAll(filter);
}

async function createRequest(data) {
  const vendor = await vendorRepo.findById(data.vendorId);
  if (!vendor) throw Object.assign(new Error('Vendor not found'), { statusCode: 404 });

  const requestRef = generateRequestRef();
  const sharePointPath = buildSharepointPath({
    vendorShortCode: vendor.shortCode,
    branchCode: data.branchCode,
    type: data.type,
    requestRef,
  });

  const result = await footageRepo.create({ ...data, requestRef, sharePointPath, status: 'pending' });
  return { _id: result.insertedId, requestRef, sharePointPath };
}

async function markUploaded(requestRef) {
  const request = await footageRepo.findByRef(requestRef);
  if (!request) throw Object.assign(new Error('Footage request not found'), { statusCode: 404 });

  await footageRepo.markUploaded(requestRef, request.sharePointPath);
}

module.exports = { listByVendor, listAll, createRequest, markUploaded };
