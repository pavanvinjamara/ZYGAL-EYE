// backend/src/routes/index.js
const router = require('express').Router();

// --- Public / shared ---
router.use('/auth', require('./auth.routes'));
router.use('/notifications', require('./notification.routes'));

// --- Vendor-portal (scoped to own vendorId via scopeToOwnVendor) ---
router.use('/vendors', require('./vendor/vendor.routes'));
router.use('/tickets', require('./vendor/ticket.routes'));
router.use('/sla', require('./vendor/sla.routes'));
router.use('/penalties', require('./vendor/penalty.routes'));
router.use('/sop', require('./vendor/sop.routes'));
router.use('/mis', require('./vendor/mis.routes'));
router.use('/ble', require('./vendor/ble.routes'));
router.use('/footage', require('./vendor/footage.routes'));

// --- Admin / IIFL SOC (requireRole('iifl_soc', 'admin')) ---
router.use('/admin', require('./admin/admin.routes'));
router.use('/admin/onboarding', require('./admin/onboarding.routes'));
router.use('/admin/vendors', require('./admin/adminVendor.routes'));
router.use('/admin/users', require('./admin/adminUser.routes'));
router.use('/admin/ble', require('./admin/adminBle.routes'));
router.use('/admin/footage', require('./admin/adminFootage.routes'));
router.use('/admin/audit-logs', require('./admin/auditLog.routes'));

module.exports = router;
