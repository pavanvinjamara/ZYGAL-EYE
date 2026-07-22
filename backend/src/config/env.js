// backend/src/config/env.js
require('dotenv').config();

const REQUIRED = ['MONGO_URI', 'MONGO_DB', 'JWT_SECRET'];

function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  MONGO_DB: process.env.MONGO_DB || 'iifl_eye',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '12h',
  JWT_REFRESH_EXPIRY_DAYS: parseInt(process.env.JWT_REFRESH_EXPIRY_DAYS, 10) || 30,
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB, 10) || 25,
  SHAREPOINT_BASE_URL: process.env.SHAREPOINT_BASE_URL || 'https://iifl.sharepoint.com/sites/eye-footage',
  MIS_WINDOW_MINUTES: parseInt(process.env.MIS_WINDOW_MINUTES, 10) || 30,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,
};

module.exports = { env, validateEnv };
