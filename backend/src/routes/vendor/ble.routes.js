// backend/src/routes/vendor/ble.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/ble.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');

router.use(authenticate);

router.get('/:vendorId', scopeToOwnVendor, ctrl.list);
router.post('/:assetTag/ping', ctrl.ping);
router.patch('/:assetTag/status', ctrl.setStatus);

module.exports = router;
