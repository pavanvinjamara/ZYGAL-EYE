// backend/src/models/sopViolation.model.js
const sopViolationSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['vendorId', 'branchCode', 'type', 'severity', 'status'],
    properties: {
      _id: { bsonType: 'objectId' },
      violationRef: { bsonType: 'string' }, // SOP-ANG-041
      vendorId: { bsonType: 'objectId' },
      branchCode: { bsonType: 'string' },
      operator: { bsonType: 'string' },
      type: { bsonType: 'string' },
      severity: { enum: ['critical', 'high', 'medium'] },
      penaltyAmount: { bsonType: 'int' },
      status: { enum: ['open', 'acknowledged', 'disputed', 'resolved'] },
      detail: { bsonType: 'string' },
      occurredAt: { bsonType: 'date' },
    },
  },
};

const otpLogSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['vendorId', 'branchCode', 'checklist', 'status'],
    properties: {
      _id: { bsonType: 'objectId' },
      vendorId: { bsonType: 'objectId' },
      branchCode: { bsonType: 'string' },
      operator: { bsonType: 'string' },
      accessType: { bsonType: 'string' },
      checklist: {
        bsonType: 'object',
        properties: {
          branch_open: { bsonType: 'bool' },
          identity_verified: { bsonType: 'bool' },
          vault_clear: { bsonType: 'bool' },
          no_suspicious: { bsonType: 'bool' },
          cameras_live: { bsonType: 'bool' },
          reason_logged: { bsonType: 'bool' },
          dual_custody: { bsonType: 'bool' },
        },
      },
      status: { enum: ['compliant', 'violation', 'denied', 'escalated'] },
      durationSeconds: { bsonType: 'int' },
      issuedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { sopViolationSchema, otpLogSchema };
