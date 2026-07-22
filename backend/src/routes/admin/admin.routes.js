// backend/src/routes/admin/admin.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/admin.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { requireRole, requireInternal } = require('../../middleware/role.middleware');

router.use(authenticate, requireInternal, requireRole('iifl_soc'));

router.get('/overview', ctrl.overview);
router.get('/leaderboard', ctrl.leaderboard);

module.exports = router;
