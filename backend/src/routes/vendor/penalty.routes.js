// backend/src/routes/vendor/penalty.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/penalty.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');

router.use(authenticate);

router.get('/:vendorId', scopeToOwnVendor, ctrl.list);
router.get('/:vendorId/summary', scopeToOwnVendor, ctrl.monthlySummary);
router.post('/:id/dispute', ctrl.dispute);

module.exports = router;
