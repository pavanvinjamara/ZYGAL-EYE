// backend/src/validators/ticket.validator.js
const Joi = require('joi');

const create = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  branchCode: Joi.string().required(),
  subject: Joi.string().min(3).max(200).required(),
  description: Joi.string().allow('').max(5000),
  priority: Joi.string().valid('P1', 'P2', 'P3').required(),
});

const addTimelineEntry = Joi.object({
  type: Joi.string().valid('open', 'work', 'done', 'note').required(),
  text: Joi.string().min(1).max(2000).required(),
});

const resolve = Joi.object({
  engineer: Joi.string().required(),
  branchManager: Joi.string().required(),
  notes: Joi.string().allow('').max(2000),
  // fileUrl is set server-side from the uploaded file, not client-supplied
});

module.exports = { create, addTimelineEntry, resolve };
