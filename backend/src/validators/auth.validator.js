// backend/src/validators/auth.validator.js
const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  vendorShortCode: Joi.string().optional().allow('', null),
});

// Public self-registration is intentionally restricted to non-privileged,
// vendor-scoped roles. "admin" and "iifl_soc" accounts are only created
// via the authenticated admin-invite flow (see admin.validator.js::inviteUser).
const register = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('engineer', 'analyst', 'readonly').required(),
  vendorId: Joi.string().hex().length(24).required(),
});

const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

const refresh = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { login, register, changePassword, refresh };
