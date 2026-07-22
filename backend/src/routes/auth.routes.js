// backend/src/routes/auth.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const vendorCtrl = require('../controllers/vendor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { validate } = require('../middleware/validate.middleware');
const authValidator = require('../validators/auth.validator');

// Public: powers the vendor-select dropdown on the vendor login screen.
router.get('/vendors', vendorCtrl.listPublic);

// Two distinct login endpoints -- deliberately not merged. Each rejects
// the other portal's account type outright (see auth.service.js).
router.post('/vendor/login', authLimiter, validate(authValidator.vendorLogin), ctrl.loginVendor);
router.post('/admin/login', authLimiter, validate(authValidator.adminLogin), ctrl.loginAdmin);

router.post('/refresh', authLimiter, validate(authValidator.refresh), ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.me);

router.post('/register', authLimiter, validate(authValidator.register), ctrl.register);
router.post('/change-password', authenticate, validate(authValidator.changePassword), ctrl.changePassword);

module.exports = router;