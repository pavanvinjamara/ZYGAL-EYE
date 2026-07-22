// backend/src/utils/password.util.js
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// Simple strength check: 8+ chars, at least one letter and one number
function isStrongPassword(plain) {
  return typeof plain === 'string' && /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(plain);
}

module.exports = { hashPassword, comparePassword, isStrongPassword };
