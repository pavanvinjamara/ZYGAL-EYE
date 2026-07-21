const COLLECTION_NAME = 'refreshTokens';

const refreshTokenJsonSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'tokenHash', 'expiresAt', 'revoked'],
    properties: {
      userId:    { bsonType: 'objectId' },
      tokenHash: { bsonType: 'string' },
      userAgent: { bsonType: ['string', 'null'] },
      ip:        { bsonType: ['string', 'null'] },
      expiresAt: { bsonType: 'date' },
      revoked:   { bsonType: 'bool' },
      createdAt: { bsonType: 'date' },
    },
  },
};

module.exports = { COLLECTION_NAME, refreshTokenJsonSchema };