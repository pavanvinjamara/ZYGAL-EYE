// backend/src/routes/vendor/sla.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/sla.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');

router.use(authenticate);

router.get('/:vendorId/summary', scopeToOwnVendor, ctrl.summary);
router.get('/:vendorId/breaches', scopeToOwnVendor, ctrl.breaches);

module.exports = router;
