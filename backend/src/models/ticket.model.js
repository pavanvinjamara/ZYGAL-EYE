// backend/src/models/ticket.model.js
const ticketSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['ticketRef', 'vendorId', 'branchCode', 'priority', 'status', 'openedAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      ticketRef: { bsonType: 'string' }, // #ZD-10815
      vendorId: { bsonType: 'objectId' },
      branchCode: { bsonType: 'string' },
      subject: { bsonType: 'string' },
      description: { bsonType: 'string' },
      priority: { enum: ['P1', 'P2', 'P3'] },
      status: { enum: ['open', 'in-progress', 'resolved'] },
      slaStatus: { enum: ['ok', 'warn', 'breach'] },
      openedAt: { bsonType: 'date' },
      resolvedAt: { bsonType: ['date', 'null'] },
      slaTargetHours: { bsonType: 'int' },
      timeline: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          properties: {
            type: { enum: ['open', 'work', 'done', 'note'] },
            text: { bsonType: 'string' },
            at: { bsonType: 'date' },
            byUserId: { bsonType: ['objectId', 'null'] },
          },
        },
      },
      closureReport: {
        bsonType: ['object', 'null'],
        properties: {
          fileUrl: { bsonType: 'string' },
          engineer: { bsonType: 'string' },
          branchManager: { bsonType: 'string' },
          notes: { bsonType: 'string' },
          uploadedAt: { bsonType: 'date' },
        },
      },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { ticketSchema };
