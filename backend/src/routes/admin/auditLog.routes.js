// backend/src/routes/admin/auditLog.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/auditLog.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole, requireInternal } = require('../../middleware/role.middleware');

router.use(authenticate, requireInternal, requireRole('iifl_soc'));

router.get('/', ctrl.list);
router.get('/user/:userId', ctrl.listByUser);

module.exports = router;
