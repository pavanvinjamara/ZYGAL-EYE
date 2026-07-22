// backend/src/routes/vendor/footage.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/footage.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');

router.use(authenticate);

router.get('/:vendorId', scopeToOwnVendor, ctrl.list);
router.post('/:requestRef/uploaded', ctrl.markUploaded);

module.exports = router;
