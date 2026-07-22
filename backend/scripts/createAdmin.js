// backend/scripts/createAdmin.js
//
// Bootstraps an internal admin/iifl_soc user directly in the database.
// Use this the first time -- once you have one admin account, create
// further admins through POST /api/admin/users/invite instead.
//
// Usage:
//   node scripts/createAdmin.js --email admin@iifl.com --password Passw0rd1! --name "IIFL Admin" --role iifl_soc
//
// Flags:
//   --email     required
//   --password  required, 8+ chars with a letter and a number
//   --name      optional, defaults to "Admin"
//   --role      optional, "iifl_soc" (default) or "admin"

const { connectDB, closeDB } = require('../src/config/db');
const COL = require('../src/db/collections');
const { hashPassword, isStrongPassword } = require('../src/utils/password.util');

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach((arg, i, arr) => {
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = arr[i + 1];
      args[key] = next && !next.startsWith('--') ? next : true;
    }
  });
  return args;
}

async function run() {
  const { email, password, name = 'Admin', role = 'iifl_soc' } = parseArgs();

  if (!email || !password) {
    console.error('Usage: node scripts/createAdmin.js --email <email> --password <password> [--name "Full Name"] [--role iifl_soc|admin]');
    process.exit(1);
  }

  if (!['iifl_soc', 'admin'].includes(role)) {
    console.error('Error: --role must be "iifl_soc" or "admin"');
    process.exit(1);
  }

  if (!isStrongPassword(password)) {
    console.error('Error: password must be 8+ characters with at least one letter and one number');
    process.exit(1);
  }

  const db = await connectDB();

  const existing = await db.collection(COL.USERS).findOne({ email: email.toLowerCase() });
  if (existing) {
    console.error(`Error: a user with email ${email} already exists (id: ${existing._id})`);
    await closeDB();
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const result = await db.collection(COL.USERS).insertOne({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone: '',
    role,
    vendorId: null, // internal IIFL staff — not tied to a vendor
    branchesAssigned: [],
    status: 'active', // active immediately, no invite/activation step needed
    createdAt: new Date(),
    lastLoginAt: null,
  });

  console.log(`Admin account created:`);
  console.log(`  _id:   ${result.insertedId}`);
  console.log(`  email: ${email}`);
  console.log(`  role:  ${role}`);
  console.log(`\nLog in via POST /api/auth/login with this email/password.`);

  await closeDB();
}

run().catch((err) => {
  console.error('Failed to create admin:', err.message);
  process.exit(1);
});
