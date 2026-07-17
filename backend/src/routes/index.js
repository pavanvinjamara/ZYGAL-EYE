const express = require("express");

const router = express.Router();

/**
 * Authentication
 */
router.use("/auth", require("./auth.routes"));

module.exports = router;