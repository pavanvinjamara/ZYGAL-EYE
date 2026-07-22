// backend/src/routes/auth.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const { validate } = require('../middleware/validate.middleware');
const authValidator = require('../validators/auth.validator');

router.post('/login', authLimiter, validate(authValidator.login), ctrl.login);
router.post('/refresh', authLimiter, validate(authValidator.refresh), ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.me);

// Public self-signup. New accounts land in "invited" status until an
// admin activates them (see adminUser.routes.js), so no token is required
// to hit this endpoint -- that was the "asking for access token" issue.
router.post('/register', authLimiter, validate(authValidator.register), ctrl.register);

router.post('/change-password', authenticate, validate(authValidator.changePassword), ctrl.changePassword);

module.exports = router;
