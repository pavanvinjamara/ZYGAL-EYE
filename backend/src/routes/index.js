const express = require("express");

const router = express.Router();

/**
 * Authentication
 */
router.use("/auth", require("./auth.routes"));
router.use('/vendors', require('./vendor.routes'));

module.exports = router;