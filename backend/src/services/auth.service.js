const userRepository = require("../repositories/user.repository");
const { toPublicUser } = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password.util");
const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    hashToken
} = require("../utils/jwt.util");

class AuthError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

async function signup({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
        throw new AuthError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({ name, email, passwordHash });

    return toPublicUser(user);
}

async function login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new AuthError("Invalid email or password", 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new AuthError("Invalid email or password", 401);
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.addRefreshToken(user._id, hashToken(refreshToken));

    return {
        user: toPublicUser(user),
        accessToken,
        refreshToken
    };
}

async function refresh(refreshToken) {
    if (!refreshToken) {
        throw new AuthError("Refresh token is required", 401);
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
        throw new AuthError("Invalid or expired refresh token", 401);
    }

    const user = await userRepository.findById(decoded.sub);
    const tokenHash = hashToken(refreshToken);

    if (!user || !user.refreshTokens?.includes(tokenHash)) {
        throw new AuthError("Refresh token has been revoked", 401);
    }

    // Rotate: invalidate the old refresh token, issue a new pair
    await userRepository.removeRefreshToken(user._id, tokenHash);

    const payload = { sub: user._id.toString(), email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await userRepository.addRefreshToken(user._id, hashToken(newRefreshToken));

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

async function logout(userId, refreshToken) {
    if (userId && refreshToken) {
        await userRepository.removeRefreshToken(userId, hashToken(refreshToken));
    }
    return true;
}

module.exports = { signup, login, refresh, logout, AuthError };