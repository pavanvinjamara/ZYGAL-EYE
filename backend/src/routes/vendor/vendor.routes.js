// backend/src/routes/vendor/vendor.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/vendor.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');

router.use(authenticate);

router.get('/:id', scopeToOwnVendor, ctrl.get);
router.get('/:id/branches', scopeToOwnVendor, ctrl.getBranches);

module.exports = router;
