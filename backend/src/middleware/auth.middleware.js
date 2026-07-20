const { verifyAccessToken } = require("../utils/jwt.util");

/**
 * Protects a route: requires a valid "Bearer <accessToken>" Authorization header.
 * On success, attaches the decoded token payload to req.user.
 */
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ success: false, message: "Authentication token missing" });
    }

    try {
        req.user = verifyAccessToken(token);
        return next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired access token" });
    }
}

/**
 * Like requireAuth, but doesn't reject the request if there's no/invalid token.
 * Useful for routes that behave differently for logged-in vs anonymous users.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme === "Bearer" && token) {
        try {
            req.user = verifyAccessToken(token);
        } catch (err) {
            // ignore invalid token, treat as anonymous
        }
    }
    return next();
}

module.exports = { requireAuth, optionalAuth };