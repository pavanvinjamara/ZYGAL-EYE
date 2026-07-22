// backend/src/routes/vendor/mis.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/mis.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');
const { misUpload } = require('../../middleware/upload.middleware');

router.use(authenticate);

router.get('/:vendorId', scopeToOwnVendor, ctrl.list);
router.post('/', misUpload.single('file'), ctrl.upload);

module.exports = router;
