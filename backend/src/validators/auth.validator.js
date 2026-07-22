// backend/src/validators/auth.validator.js
const Joi = require('joi');

const vendorLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  vendorShortCode: Joi.string().required(), // mandatory here, no more optional/allow('')
});

const adminLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // no vendorShortCode field at all -- admin login never accepts one
});

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

module.exports = { vendorLogin, adminLogin, register, changePassword, refresh };