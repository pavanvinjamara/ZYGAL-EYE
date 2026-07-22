// backend/src/models/bleAsset.model.js
const bleAssetSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['assetTag', 'vendorId', 'branchCode', 'status'],
    properties: {
      _id: { bsonType: 'objectId' },
      assetTag: { bsonType: 'string' }, // BLE-001
      name: { bsonType: 'string' },
      type: { enum: ['locker', 'cassette', 'device', 'firearm', 'key'] },
      vendorId: { bsonType: 'objectId' },
      branchCode: { bsonType: 'string' },
      zone: { bsonType: 'string' },
      status: { enum: ['ok', 'moving', 'missing'] },
      batteryPct: { bsonType: 'int' },
      location: {
        bsonType: 'object',
        properties: {
          lat: { bsonType: 'double' },
          lng: { bsonType: 'double' },
        },
      },
      lastPingAt: { bsonType: 'date' },
    },
  },
};

module.exports = { bleAssetSchema };
