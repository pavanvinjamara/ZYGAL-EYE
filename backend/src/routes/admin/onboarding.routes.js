// backend/src/routes/admin/onboarding.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/onboarding.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const onboardingValidator = require('../../validators/onboarding.validator');

router.use(authenticate, requireRole('iifl_soc'));

router.post('/vendor-details', validate(onboardingValidator.vendorDetailsStep), ctrl.vendorDetailsStep);
router.post('/contact', validate(onboardingValidator.contactStep), ctrl.contactStep);
router.post('/sites', validate(onboardingValidator.siteAllocationStep), ctrl.siteAllocationStep);
router.post('/activate', validate(onboardingValidator.reviewActivateStep), ctrl.reviewActivateStep);

module.exports = router;
