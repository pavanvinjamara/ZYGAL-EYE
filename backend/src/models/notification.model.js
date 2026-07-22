// backend/src/models/notification.model.js
const notificationSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'title', 'read', 'createdAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      userId: { bsonType: 'objectId' },
      title: { bsonType: 'string' },
      body: { bsonType: 'string' },
      type: { enum: ['ticket', 'sla', 'penalty', 'sop', 'mis', 'ble', 'footage', 'system'] },
      linkRef: { bsonType: 'string' }, // e.g. ticketRef, requestRef
      read: { bsonType: 'bool' },
      createdAt: { bsonType: 'date' },
    },
  },
};

module.exports = { notificationSchema };
