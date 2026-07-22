// backend/src/validators/sop.validator.js
const Joi = require('joi');

const checklist = Joi.object({
  branch_open: Joi.boolean().required(),
  identity_verified: Joi.boolean().required(),
  vault_clear: Joi.boolean().required(),
  no_suspicious: Joi.boolean().required(),
  cameras_live: Joi.boolean().required(),
  reason_logged: Joi.boolean().required(),
  dual_custody: Joi.boolean().required(),
});

const issueOtp = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  branchCode: Joi.string().required(),
  operator: Joi.string().required(),
  accessType: Joi.string().required(),
  checklist: checklist.required(),
  durationSeconds: Joi.number().integer().min(0).optional(),
});

const createViolation = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  branchCode: Joi.string().required(),
  operator: Joi.string().allow(''),
  type: Joi.string().required(),
  severity: Joi.string().valid('critical', 'high', 'medium').required(),
  penaltyAmount: Joi.number().integer().min(0).default(0),
  detail: Joi.string().allow('').max(2000),
});

const updateViolationStatus = Joi.object({
  status: Joi.string().valid('open', 'acknowledged', 'disputed', 'resolved').required(),
});

module.exports = { checklist, issueOtp, createViolation, updateViolationStatus };
