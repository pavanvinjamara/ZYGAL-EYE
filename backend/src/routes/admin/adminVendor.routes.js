// backend/src/routes/admin/adminVendor.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/vendor.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole, requireInternal } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const vendorValidator = require('../../validators/vendor.validator');

router.use(authenticate, requireInternal, requireRole('iifl_soc'));

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.get('/:id/branches', ctrl.getBranches);
router.post('/', validate(vendorValidator.create), ctrl.create);
router.patch('/:id', validate(vendorValidator.update), ctrl.update);
router.post('/:id/activate', ctrl.activate);
router.post('/:id/suspend', ctrl.suspend);

module.exports = router;
