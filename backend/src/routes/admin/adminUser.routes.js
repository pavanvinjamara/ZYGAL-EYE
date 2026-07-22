// backend/src/routes/admin/adminUser.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/user.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole, requireInternal } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const adminValidator = require('../../validators/admin.validator');

router.use(authenticate, requireInternal, requireRole('iifl_soc'));

router.get('/', ctrl.list);
router.get('/vendor/:vendorId', ctrl.listByVendor);
router.post('/invite', validate(adminValidator.inviteUser), ctrl.invite);
router.patch('/:id/status', validate(adminValidator.updateUserStatus), ctrl.updateStatus);

module.exports = router;
