const COLLECTION_NAME = 'users';

const userJsonSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['vendorId', 'name', 'email', 'passwordHash', 'role', 'status'],
    properties: {
      vendorId:  { bsonType: 'objectId' },
      name:      { bsonType: 'string', minLength: 2 },
      email:     { bsonType: 'string', pattern: '^.+@.+\\..+$' },
      passwordHash: { bsonType: 'string' },
      role:      { enum: ['vendor_admin', 'vendor_viewer', 'iifl_admin'] },
      phone:     { bsonType: ['string', 'null'] },
      status:    { enum: ['active', 'disabled'] },
      lastLoginAt: { bsonType: ['date', 'null'] },
      failedLoginAttempts: { bsonType: 'int' },
      lockedUntil: { bsonType: ['date', 'null'] },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
  },
};

module.exports = { COLLECTION_NAME, userJsonSchema };