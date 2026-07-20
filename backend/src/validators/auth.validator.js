const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(body) {
    const errors = [];
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
        errors.push("A valid email is required");
    }

    if (!password || typeof password !== "string" || password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    return { valid: errors.length === 0, errors };
}

function validateLogin(body) {
    const errors = [];
    const { email, password } = body;

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
        errors.push("A valid email is required");
    }

    if (!password || typeof password !== "string") {
        errors.push("Password is required");
    }

    return { valid: errors.length === 0, errors };
}

module.exports = { validateSignup, validateLogin };