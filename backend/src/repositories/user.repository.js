const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { COLLECTION_NAME, buildUserDocument } = require("../models/user.model");

function collection() {
    return getDB().collection(COLLECTION_NAME);
}

/**
 * Call once at startup (after connectDB) to ensure indexes exist.
 */
async function ensureIndexes() {
    await collection().createIndex({ email: 1 }, { unique: true });
}

async function findByEmail(email) {
    return collection().findOne({ email: email.toLowerCase() });
}

async function findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return collection().findOne({ _id: new ObjectId(id) });
}

async function create({ name, email, passwordHash }) {
    const doc = buildUserDocument({ name, email, passwordHash });
    const result = await collection().insertOne(doc);
    return { ...doc, _id: result.insertedId };
}

async function addRefreshToken(userId, tokenHash) {
    await collection().updateOne(
        { _id: new ObjectId(userId) },
        { $push: { refreshTokens: tokenHash }, $set: { updatedAt: new Date() } }
    );
}

async function removeRefreshToken(userId, tokenHash) {
    await collection().updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { refreshTokens: tokenHash }, $set: { updatedAt: new Date() } }
    );
}

module.exports = {
    ensureIndexes,
    findByEmail,
    findById,
    create,
    addRefreshToken,
    removeRefreshToken
};