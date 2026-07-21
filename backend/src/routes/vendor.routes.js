const router = require('express').Router();
const vendorController = require('../controllers/vendor.controller');
const { publicApiLimiter } = require('../middleware/rateLimit.middleware');

router.get('/public', publicApiLimiter, vendorController.listPublicVendors);

module.exports = router;