const express = require("express");

const router = express.Router();

/**
 * Authentication Routes
 */

router.post("/signup", (req, res) => {
    res.json({
        success: true,
        message: "Signup API"
    });
});

router.post("/login", (req, res) => {
    res.json({
        success: true,
        message: "Login API"
    });
});

router.post("/refresh", (req, res) => {
    res.json({
        success: true,
        message: "Refresh Token API"
    });
});

router.post("/logout", (req, res) => {
    res.json({
        success: true,
        message: "Logout API"
    });
});

module.exports = router;