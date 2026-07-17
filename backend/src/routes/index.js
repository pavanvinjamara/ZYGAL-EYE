
const express = require('express');
const router = express.Router();


// user routes
router.use('/users', require('./authRoutes'));

module.exports = router;