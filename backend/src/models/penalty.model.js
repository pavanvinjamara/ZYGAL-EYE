// backend/src/models/penalty.model.js
const penaltySchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['vendorId', 'ticketRef', 'amount', 'incidentDate'],
    properties: {
      _id: { bsonType: 'objectId' },
      vendorId: { bsonType: 'objectId' },
      ticketRef: { bsonType: 'string' },
      description: { bsonType: 'string' },
      ruleApplied: { bsonType: 'string' },
      amount: { bsonType: 'int' },
      incidentDate: { bsonType: 'date' },
      status: { enum: ['charged', 'disputed', 'waived'] },
      disputeReason: { bsonType: ['string', 'null'] },
      month: { bsonType: 'string' }, // "2025-06" for aggregation
    },
  },
};

module.exports = { penaltySchema };
