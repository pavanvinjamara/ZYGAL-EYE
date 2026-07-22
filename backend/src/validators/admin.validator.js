// backend/src/validators/admin.validator.js
const Joi = require('joi');

const inviteUser = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'engineer', 'analyst', 'readonly', 'iifl_soc').required(),
  vendorId: Joi.string().hex().length(24).optional().allow(null),
  branchesAssigned: Joi.array().items(Joi.string()).optional(),
});

const updateUserStatus = Joi.object({
  status: Joi.string().valid('active', 'invited', 'disabled').required(),
});

const disputeDecision = Joi.object({
  action: Joi.string().valid('waive', 'reject').required(),
  note: Joi.string().allow('').max(1000),
});

const createFootageRequest = Joi.object({
  vendorId: Joi.string().hex().length(24).required(),
  branchCode: Joi.string().required(),
  type: Joi.string().valid('Transaction', 'Auction').required(),
  footageDate: Joi.date().required(),
  cameras: Joi.string().required(),
  duration: Joi.string().required(),
  requestedBy: Joi.string().required(),
  dueDate: Joi.date().required(),
});

const registerBleAsset = Joi.object({
  assetTag: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid('locker', 'cassette', 'device', 'firearm', 'key').required(),
  vendorId: Joi.string().hex().length(24).required(),
  branchCode: Joi.string().required(),
  zone: Joi.string().allow(''),
  batteryPct: Joi.number().integer().min(0).max(100).default(100),
});

module.exports = { inviteUser, updateUserStatus, disputeDecision, createFootageRequest, registerBleAsset };
