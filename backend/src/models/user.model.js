// backend/src/models/user.model.js
const userSchema = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'email', 'passwordHash', 'role', 'status'],
    properties: {
      _id: { bsonType: 'objectId' },
      name: { bsonType: 'string' },
      email: { bsonType: 'string' },
      passwordHash: { bsonType: 'string' },
      phone: { bsonType: 'string' },
      role: { enum: ['admin', 'engineer', 'analyst', 'readonly', 'iifl_soc'] },
      vendorId: { bsonType: ['objectId', 'null'] }, // null for IIFL internal users
      branchesAssigned: { bsonType: 'array', items: { bsonType: 'string' } },
      status: { enum: ['active', 'invited', 'disabled'] },
      lastLoginAt: { bsonType: ['date', 'null'] },
      createdAt: { bsonType: 'date' },
    },
  },
};

module.exports = { userSchema };
