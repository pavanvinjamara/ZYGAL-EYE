// backend/scripts/createIndexes.js
const { connectDB, closeDB } = require('../src/config/db');
const COL = require('../src/db/collections');

const { vendorSchema } = require('../src/models/vendor.model');
const { userSchema } = require('../src/models/user.model');
const { refreshTokenSchema } = require('../src/models/refreshToken.model');
const { branchSchema } = require('../src/models/branch.model');
const { cameraSchema } = require('../src/models/camera.model');
const { ticketSchema } = require('../src/models/ticket.model');
const { penaltySchema } = require('../src/models/penalty.model');
const { sopViolationSchema, otpLogSchema } = require('../src/models/sopViolation.model');
const { misUploadSchema } = require('../src/models/misUpload.model');
const { bleAssetSchema } = require('../src/models/bleAsset.model');
const { footageRequestSchema } = require('../src/models/footageRequest.model');
const { auditLogSchema } = require('../src/models/auditLog.model');
const { notificationSchema } = require('../src/models/notification.model');

async function run() {
  const db = await connectDB();

  const collectionsToCreate = [
    [COL.VENDORS, vendorSchema],
    [COL.USERS, userSchema],
    [COL.REFRESH_TOKENS, refreshTokenSchema],
    [COL.BRANCHES, branchSchema],
    [COL.CAMERAS, cameraSchema],
    [COL.TICKETS, ticketSchema],
    [COL.PENALTIES, penaltySchema],
    [COL.SOP_VIOLATIONS, sopViolationSchema],
    [COL.OTP_LOGS, otpLogSchema],
    [COL.MIS_UPLOADS, misUploadSchema],
    [COL.BLE_ASSETS, bleAssetSchema],
    [COL.FOOTAGE_REQUESTS, footageRequestSchema],
    [COL.AUDIT_LOGS, auditLogSchema],
    [COL.NOTIFICATIONS, notificationSchema],
  ];

  const existing = (await db.listCollections().toArray()).map((c) => c.name);

  for (const [name, schema] of collectionsToCreate) {
    if (!existing.includes(name)) {
      await db.createCollection(name, { validator: schema });
      console.log(`Created collection: ${name}`);
    } else {
      // keep validator in sync on repeated runs
      await db.command({ collMod: name, validator: schema });
      console.log(`Updated validator: ${name}`);
    }
  }

  // --- Indexes ---
  await db.collection(COL.USERS).createIndex({ email: 1 }, { unique: true });
  await db.collection(COL.REFRESH_TOKENS).createIndex({ token: 1 }, { unique: true });
  await db.collection(COL.REFRESH_TOKENS).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  await db.collection(COL.VENDORS).createIndex({ shortCode: 1 }, { unique: true });
  await db.collection(COL.VENDORS).createIndex(
    { 'iiflContact.email': 1 },
    { unique: true, partialFilterExpression: { 'iiflContact.email': { $exists: true } } }
  );

  await db.collection(COL.BRANCHES).createIndex({ branchCode: 1 }, { unique: true });
  await db.collection(COL.BRANCHES).createIndex({ vendorId: 1 });

  await db.collection(COL.CAMERAS).createIndex({ cameraCode: 1 }, { unique: true });
  await db.collection(COL.CAMERAS).createIndex({ branchCode: 1 });

  await db.collection(COL.TICKETS).createIndex({ ticketRef: 1 }, { unique: true });
  await db.collection(COL.TICKETS).createIndex({ vendorId: 1, status: 1 });
  await db.collection(COL.TICKETS).createIndex({ vendorId: 1, slaStatus: 1 });

  await db.collection(COL.PENALTIES).createIndex({ vendorId: 1, month: 1 });
  await db.collection(COL.PENALTIES).createIndex({ ticketRef: 1, month: 1 });

  await db.collection(COL.SOP_VIOLATIONS).createIndex({ vendorId: 1, status: 1 });
  await db.collection(COL.OTP_LOGS).createIndex({ vendorId: 1, issuedAt: -1 });

  await db.collection(COL.MIS_UPLOADS).createIndex({ vendorId: 1, type: 1, uploadedAt: -1 });

  await db.collection(COL.BLE_ASSETS).createIndex({ assetTag: 1 }, { unique: true });
  await db.collection(COL.BLE_ASSETS).createIndex({ vendorId: 1, status: 1 });

  await db.collection(COL.FOOTAGE_REQUESTS).createIndex({ requestRef: 1 }, { unique: true });
  await db.collection(COL.FOOTAGE_REQUESTS).createIndex({ vendorId: 1, status: 1 });

  await db.collection(COL.AUDIT_LOGS).createIndex({ userId: 1, createdAt: -1 });
  await db.collection(COL.NOTIFICATIONS).createIndex({ userId: 1, read: 1, createdAt: -1 });

  console.log('Indexes created.');
  await closeDB();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
