// backend/src/services/mis.service.js
const misRepo = require('../repositories/mis.repository');
const vendorRepo = require('../repositories/vendor.repository');

async function uploadMis({ vendorId, type, rows, errors }, file) {
  if (!file) throw Object.assign(new Error('No file uploaded'), { statusCode: 400 });

  const vendor = await vendorRepo.findById(vendorId);
  if (!vendor) throw Object.assign(new Error('Vendor not found'), { statusCode: 404 });

  const windowMs = (vendor.misFrequencyMinutes || 30) * 60 * 1000;
  const windowDeadline = new Date(Date.now() + windowMs);

  const result = await misRepo.create({
    vendorId,
    type,
    fileUrl: `/uploads/mis/${file.filename}`,
    fileName: file.originalname,
    rows: rows ? parseInt(rows, 10) : 0,
    sizeBytes: file.size,
    errors: errors ? parseInt(errors, 10) : 0,
    uploadedAt: new Date(),
    windowDeadline,
    onTime: true,
  });

  return { _id: result.insertedId };
}

async function listUploads(vendorId, type) {
  return misRepo.findByVendor(vendorId, type);
}

module.exports = { uploadMis, listUploads };
