// backend/src/routes/vendor/sop.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/sop.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const sopValidator = require('../../validators/sop.validator');

router.use(authenticate);

router.get('/:vendorId/violations', scopeToOwnVendor, ctrl.listViolations);
router.post('/violations', validate(sopValidator.createViolation), ctrl.createViolation);
router.patch('/violations/:id/status', validate(sopValidator.updateViolationStatus), ctrl.updateViolationStatus);

router.get('/:vendorId/otp-logs', scopeToOwnVendor, ctrl.listOtpLogs);
router.post('/otp-logs', validate(sopValidator.issueOtp), ctrl.issueOtp);

module.exports = router;
