// backend/src/models/misUpload.model.js
const misUploadSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['vendorId', 'type', 'fileUrl', 'uploadedAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      vendorId: { bsonType: 'objectId' },
      type: { enum: ['health', 'otp', 'incidents'] },
      fileUrl: { bsonType: 'string' },
      fileName: { bsonType: 'string' },
      rows: { bsonType: 'int' },
      sizeBytes: { bsonType: 'int' },
      errors: { bsonType: 'int' },
      uploadedAt: { bsonType: 'date' },
      windowDeadline: { bsonType: 'date' },
      onTime: { bsonType: 'bool' },
    },
  },
};

module.exports = { misUploadSchema };
