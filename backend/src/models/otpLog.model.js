// backend/src/models/otpLog.model.js
// Kept as its own file to match the folder structure; schema is defined
// alongside sop_violations since both live under SOP/OTP compliance.
const { otpLogSchema } = require('./sopViolation.model');

module.exports = { otpLogSchema };
