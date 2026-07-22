// backend/src/utils/objectId.util.js
const { ObjectId } = require('mongodb');

function isValidObjectId(id) {
  return typeof id === 'string' && ObjectId.isValid(id) && String(new ObjectId(id)) === id;
}

function toObjectId(id) {
  if (!isValidObjectId(id)) {
    throw Object.assign(new Error(`Invalid id: ${id}`), { statusCode: 400 });
  }
  return new ObjectId(id);
}

module.exports = { isValidObjectId, toObjectId };
