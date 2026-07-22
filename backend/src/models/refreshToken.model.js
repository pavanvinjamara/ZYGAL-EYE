// backend/src/models/refreshToken.model.js
const refreshTokenSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'token', 'expiresAt', 'createdAt'],
    properties: {
      _id: { bsonType: 'objectId' },
      userId: { bsonType: 'objectId' },
      token: { bsonType: 'string' },
      userAgent: { bsonType: 'string' },
      ip: { bsonType: 'string' },
      revoked: { bsonType: 'bool' },
      expiresAt: { bsonType: 'date' }, // paired with a TTL index
      createdAt: { bsonType: 'date' },
    },
  },
};

module.exports = { refreshTokenSchema };
