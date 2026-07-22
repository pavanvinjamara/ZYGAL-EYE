// backend/src/validators/vendor.validator.js
const Joi = require('joi');

const contact = Joi.object({
  name: Joi.string().required(),
  role: Joi.string().allow(''),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const create = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  shortCode: Joi.string().alphanum().min(2).max(10).uppercase().required(),
  brandColor: Joi.string().pattern(/^#([0-9A-Fa-f]{6})$/).optional(),
  vendorType: Joi.string().valid('primary', 'secondary', 'specialist', 'maintenance').required(),
  region: Joi.string().required(),
  slaTier: Joi.string().valid('Gold', 'Silver', 'Bronze').required(),
  contractStart: Joi.date().required(),
  gst: Joi.string().allow(''),
  pan: Joi.string().allow(''),
  cin: Joi.string().allow(''),
  registeredAddress: Joi.string().allow(''),
  misFrequencyMinutes: Joi.number().integer().min(5).max(1440).default(30),
  iiflContact: contact.required(),
});

const update = create.fork(
  ['name', 'shortCode', 'vendorType', 'region', 'slaTier', 'contractStart', 'iiflContact'],
  (s) => s.optional()
);

module.exports = { create, update };
