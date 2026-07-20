/**
 * User model
 * Defines the shape of a User document. No DB access here -
 * see src/repositories/user.repository.js for queries.
 */

const COLLECTION_NAME = "users";

/**
 * Factory for a new user document (used by the repository on insert).
 */
function buildUserDocument({ name, email, passwordHash }) {
    const now = new Date();
    return {
        name,
        email: email.toLowerCase(),
        password: passwordHash,
        refreshTokens: [], // hashes of currently-valid refresh tokens
        createdAt: now,
        updatedAt: now
    };
}

/**
 * Strip sensitive fields before sending a user object back to clients.
 */
function toPublicUser(userDoc) {
    if (!userDoc) return null;
    const { _id, name, email, createdAt } = userDoc;
    return { id: _id, name, email, createdAt };
}

module.exports = { COLLECTION_NAME, buildUserDocument, toPublicUser };