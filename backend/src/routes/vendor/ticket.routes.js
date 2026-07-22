// backend/src/routes/vendor/ticket.routes.js
const router = require('express').Router();
const ctrl = require('../../controllers/ticket.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { scopeToOwnVendor } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { closureReportUpload } = require('../../middleware/upload.middleware');
const ticketValidator = require('../../validators/ticket.validator');

router.use(authenticate);

router.get('/:vendorId', scopeToOwnVendor, ctrl.list);
router.get('/ref/:ticketRef', ctrl.get);
router.post('/', validate(ticketValidator.create), ctrl.create);
router.post('/:ticketRef/timeline', validate(ticketValidator.addTimelineEntry), ctrl.addTimelineEntry);
router.patch('/:ticketRef/status', ctrl.updateStatus);
router.post(
  '/:ticketRef/resolve',
  closureReportUpload.single('closureReport'),
  validate(ticketValidator.resolve),
  ctrl.resolve
);

module.exports = router;
