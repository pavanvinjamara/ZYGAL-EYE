// backend/src/controllers/notification.controller.js
const notificationService = require('../services/notification.service');
const { ok, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    const unreadOnly = req.query.unread === 'true';
    return ok(res, await notificationService.listForUser(req.user.sub, unreadOnly));
  } catch (err) {
    return fail(res, err);
  }
}

async function markRead(req, res) {
  try {
    await notificationService.markRead(req.params.id);
    return ok(res, { message: 'Marked as read' });
  } catch (err) {
    return fail(res, err);
  }
}

async function markAllRead(req, res) {
  try {
    await notificationService.markAllRead(req.user.sub);
    return ok(res, { message: 'All notifications marked as read' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, markRead, markAllRead };
