// backend/src/validators/onboarding.validator.js
const Joi = require('joi');

// Step 1: Vendor details
const vendorDetailsStep = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  shortCode: Joi.string().alphanum().min(2).max(10).uppercase().required(),
  vendorType: Joi.string().valid('primary', 'secondary', 'specialist', 'maintenance').required(),
  region: Joi.string().required(),
  slaTier: Joi.string().valid('Gold', 'Silver', 'Bronze').required(),
  gst: Joi.string().allow(''),
  pan: Joi.string().allow(''),
  cin: Joi.string().allow(''),
  registeredAddress: Joi.string().allow(''),
});

// Step 2: IIFL contact
const contactStep = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  name: Joi.string().required(),
  role: Joi.string().allow(''),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

// Step 3: Branch/site allocation
const siteAllocationStep = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  branches: Joi.array().items(
    Joi.object({
      branchCode: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      region: Joi.string().valid('North', 'South', 'East', 'West', 'Central').required(),
      totalCameras: Joi.number().integer().min(0).default(0),
    })
  ).min(1).required(),
});

// Step 4: Review & activate
const reviewActivateStep = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  confirmed: Joi.boolean().valid(true).required(),
});

module.exports = { vendorDetailsStep, contactStep, siteAllocationStep, reviewActivateStep };
