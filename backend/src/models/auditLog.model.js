// backend/src/models/auditLog.model.js
const auditLogSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'action', 'createdAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      userId: { bsonType: 'objectId' },
      action: { bsonType: 'string' },       // "vendor.activate", "user.disable"
      targetType: { bsonType: 'string' },   // "vendor", "user", "ticket", ...
      targetId: { bsonType: 'string' },
      metadata: { bsonType: 'object' },
      ip: { bsonType: 'string' },
      createdAt: { bsonType: 'date' },
    },
  },
};

module.exports = { auditLogSchema };
