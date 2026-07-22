// backend/src/models/footageRequest.model.js
const footageRequestSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['requestRef', 'type', 'branchCode', 'vendorId', 'status'],
    properties: {
      _id: { bsonType: 'objectId' },
      requestRef: { bsonType: 'string' }, // FR-2025-0041
      type: { enum: ['Transaction', 'Auction'] },
      branchCode: { bsonType: 'string' },
      vendorId: { bsonType: 'objectId' },
      footageDate: { bsonType: 'date' },
      cameras: { bsonType: 'string' },
      duration: { bsonType: 'string' },
      requestedBy: { bsonType: 'string' },
      sharePointPath: { bsonType: 'string' },
      dueDate: { bsonType: 'date' },
      status: { enum: ['pending', 'uploaded', 'partial', 'overdue'] },
    },
  },
};

module.exports = { footageRequestSchema };
