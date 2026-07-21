const COLLECTION_NAME = 'vendors';

const vendorJsonSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['code', 'name', 'status'],
    properties: {
      code:   { bsonType: 'string' },      // e.g. "zygal", used in login dropdown
      name:   { bsonType: 'string' },
      shortCode: { bsonType: ['string', 'null'] },
      status: { enum: ['active', 'suspended'] },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { COLLECTION_NAME, vendorJsonSchema };