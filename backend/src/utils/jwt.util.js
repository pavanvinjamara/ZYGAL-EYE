// backend/src/utils/jwt.util.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { env } = require('../config/env');

function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function generateRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

function refreshTokenExpiry() {
  const days = env.JWT_REFRESH_EXPIRY_DAYS;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = { signAccessToken, verifyAccessToken, generateRefreshToken, refreshTokenExpiry };
