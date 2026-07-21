const rateLimit = require('express-rate-limit');

// Loose limit — this is just a static dropdown list, but still throttle it
const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,              // 30 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again shortly.' },
});

// Tighter limit for login itself — brute-force protection
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 login attempts per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

module.exports = { publicApiLimiter, loginLimiter };