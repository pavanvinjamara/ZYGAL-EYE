// backend/src/models/branch.model.js
const branchSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['branchCode', 'vendorId', 'region'],
    properties: {
      _id: { bsonType: 'objectId' },
      branchCode: { bsonType: 'string' }, // e.g. IIFL-MUM-047
      city: { bsonType: 'string' },
      state: { bsonType: 'string' },
      region: { enum: ['North', 'South', 'East', 'West', 'Central'] },
      vendorId: { bsonType: 'objectId' },
      totalCameras: { bsonType: 'int' },
      camerasOnline: { bsonType: 'int' },
      nvrStatus: { enum: ['ONLINE', 'OFFLINE', 'DEGRADED'] },
      networkUptimePct: { bsonType: 'double' },
      cloudBackupStatus: { enum: ['OK', 'FAIL', 'PARTIAL'] },
      lastSeenAt: { bsonType: 'date' },
    },
  },
};

module.exports = { branchSchema };
