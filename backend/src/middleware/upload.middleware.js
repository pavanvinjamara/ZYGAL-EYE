// backend/src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { env } = require('../config/env');

const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function storageFor(subfolder) {
  const dir = path.join(uploadRoot, subfolder);
  ensureDir(dir);
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      cb(null, `${Date.now()}-${safeName}`);
    },
  });
}

const fileFilter = (allowedExt) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExt.includes(ext)) {
    return cb(Object.assign(new Error(`Unsupported file type: ${ext}`), { statusCode: 400 }));
  }
  cb(null, true);
};

// Closure reports attached when resolving a ticket (PDF/DOC/images)
const closureReportUpload = multer({
  storage: storageFor('closure-reports'),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: fileFilter(['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']),
});

// MIS files (health/otp/incidents) — CSV/XLSX
const misUpload = multer({
  storage: storageFor('mis'),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
  fileFilter: fileFilter(['.csv', '.xlsx', '.xls']),
});

module.exports = { closureReportUpload, misUpload };
