// backend/scripts/seed.js
const { connectDB, closeDB } = require('../src/config/db');
const COL = require('../src/db/collections');
const { hashPassword } = require('../src/utils/password.util');

async function run() {
  const db = await connectDB();

  console.log('Clearing existing demo data...');
  await Promise.all([
    db.collection(COL.VENDORS).deleteMany({ shortCode: 'ZG' }),
    db.collection(COL.USERS).deleteMany({ email: { $in: ['r.kumar@zygal.io', 'soc@iifl.com'] } }),
    db.collection(COL.BRANCHES).deleteMany({ branchCode: 'IIFL-MUM-047' }),
  ]);

  // --- Vendor ---
  const vendorResult = await db.collection(COL.VENDORS).insertOne({
    name: 'Zygal',
    shortCode: 'ZG',
    brandColor: '#0891B2',
    vendorType: 'primary',
    region: 'PAN India',
    slaTier: 'Gold',
    contractStart: new Date('2024-01-01'),
    gst: '',
    pan: '',
    cin: '',
    registeredAddress: '',
    misFrequencyMinutes: 30,
    branchCount: 1,
    cameraCount: 16,
    iiflContact: {
      name: 'Priya Sharma',
      role: 'Vendor Relationship Manager',
      email: 'p.sharma@iifl.com',
      phone: '+91-9820000000',
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log(`Vendor created: Zygal (${vendorResult.insertedId})`);

  // --- Vendor admin user ---
  const vendorPasswordHash = await hashPassword('Passw0rd1!');
  const vendorUserResult = await db.collection(COL.USERS).insertOne({
    name: 'Rajesh Kumar',
    email: 'r.kumar@zygal.io',
    passwordHash: vendorPasswordHash,
    phone: '+91-9800000000',
    role: 'admin',
    vendorId: vendorResult.insertedId,
    branchesAssigned: [],
    status: 'active',
    createdAt: new Date(),
    lastLoginAt: null,
  });
  console.log(`Vendor user created: r.kumar@zygal.io / Passw0rd1! (${vendorUserResult.insertedId})`);

  // --- IIFL internal SOC user ---
  const socPasswordHash = await hashPassword('Passw0rd1!');
  const socUserResult = await db.collection(COL.USERS).insertOne({
    name: 'IIFL SOC Admin',
    email: 'soc@iifl.com',
    passwordHash: socPasswordHash,
    phone: '+91-9811111111',
    role: 'iifl_soc',
    vendorId: null,
    branchesAssigned: [],
    status: 'active',
    createdAt: new Date(),
    lastLoginAt: null,
  });
  console.log(`Internal SOC user created: soc@iifl.com / Passw0rd1! (${socUserResult.insertedId})`);

  // --- Branch ---
  const branchResult = await db.collection(COL.BRANCHES).insertOne({
    branchCode: 'IIFL-MUM-047',
    city: 'Mumbai',
    state: 'Maharashtra',
    region: 'West',
    vendorId: vendorResult.insertedId,
    totalCameras: 16,
    camerasOnline: 16,
    nvrStatus: 'ONLINE',
    networkUptimePct: 99.1,
    cloudBackupStatus: 'OK',
    lastSeenAt: new Date(),
  });
  console.log(`Branch created: IIFL-MUM-047 (${branchResult.insertedId})`);

  console.log('\nSeed complete. Login with:');
  console.log('  Vendor portal -> email: r.kumar@zygal.io | password: Passw0rd1! | shortCode: ZG');
  console.log('  Admin portal  -> email: soc@iifl.com      | password: Passw0rd1!');

  await closeDB();
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
