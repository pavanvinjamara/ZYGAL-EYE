const authService = require("../services/auth.service");
const { validateSignup, validateLogin } = require("../validators/auth.validator");

const REFRESH_COOKIE_NAME = "refreshToken";
const isProd = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days, keep in sync with JWT_REFRESH_EXPIRES_IN
};

async function signup(req, res) {
    const { valid, errors } = validateSignup(req.body);
    if (!valid) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    try {
        const user = await authService.signup(req.body);
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: user
        });
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).json({ success: false, message: err.message });
    }
}

async function login(req, res) {
    const { valid, errors } = validateLogin(req.body);
    if (!valid) {
        return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);

        res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { user, accessToken }
        });
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).json({ success: false, message: err.message });
    }
}

async function refresh(req, res) {
    const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME];
    const tokenFromBody = req.body?.refreshToken;
    const refreshToken = tokenFromCookie || tokenFromBody;

    try {
        const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

        res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Token refreshed",
            data: { accessToken }
        });
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).json({ success: false, message: err.message });
    }
}

async function logout(req, res) {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body?.refreshToken;

    try {
        // req.user is set by the auth middleware when the caller has a valid access token
        await authService.logout(req.user?.sub, refreshToken);
        res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status(status).json({ success: false, message: err.message });
    }
}

module.exports = { signup, login, refresh, logout };