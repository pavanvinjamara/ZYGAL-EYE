// backend/src/models/vendor.model.js
const vendorSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'shortCode', 'status', 'createdAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      name: { bsonType: 'string' },
      shortCode: { bsonType: 'string' },
      brandColor: { bsonType: 'string' },
      vendorType: { enum: ['primary', 'secondary', 'specialist', 'maintenance'] },
      region: { bsonType: 'string' },
      slaTier: { enum: ['Gold', 'Silver', 'Bronze'] },
      contractStart: { bsonType: 'date' },
      gst: { bsonType: 'string' },
      pan: { bsonType: 'string' },
      cin: { bsonType: 'string' },
      registeredAddress: { bsonType: 'string' },
      misFrequencyMinutes: { bsonType: 'int' },
      branchCount: { bsonType: 'int' },
      cameraCount: { bsonType: 'int' },
      iiflContact: {
        bsonType: 'object',
        properties: {
          name: { bsonType: 'string' },
          role: { bsonType: 'string' },
          email: { bsonType: 'string' },
          phone: { bsonType: 'string' },
        },
      },
      status: { enum: ['active', 'suspended', 'onboarding'] },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { vendorSchema };
