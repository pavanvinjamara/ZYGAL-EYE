// backend/src/routes/admin/adminFootage.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/footage.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole, requireInternal } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const adminValidator = require('../../validators/admin.validator');

router.use(authenticate, requireInternal, requireRole('iifl_soc'));

router.get('/', ctrl.listAll);
router.post('/', validate(adminValidator.createFootageRequest), ctrl.create);

module.exports = router;
