// backend/src/models/camera.model.js
const cameraSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['cameraCode', 'branchCode', 'status'],
    properties: {
      _id: { bsonType: 'objectId' },
      cameraCode: { bsonType: 'string' }, // e.g. CAM-MUM-047-03
      branchCode: { bsonType: 'string' },
      vendorId: { bsonType: 'objectId' },
      label: { bsonType: 'string' },       // "Vault entrance"
      zone: { bsonType: 'string' },
      streamUrl: { bsonType: 'string' },
      status: { enum: ['online', 'offline', 'degraded'] },
      resolution: { bsonType: 'string' },
      lastPingAt: { bsonType: 'date' },
    },
  },
};

module.exports = { cameraSchema };
