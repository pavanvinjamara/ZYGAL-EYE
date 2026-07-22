// backend/src/services/notification.service.js
const notificationRepo = require('../repositories/notification.repository');

async function listForUser(userId, unreadOnly = false) {
  return notificationRepo.findByUser(userId, { unreadOnly });
}

async function markRead(id) {
  await notificationRepo.markRead(id);
}

async function markAllRead(userId) {
  await notificationRepo.markAllRead(userId);
}

// Helper other services can call to raise an in-app notification,
// e.g. notify({ userId, title: 'Ticket resolved', type: 'ticket', linkRef: ticketRef })
async function notify({ userId, title, body, type, linkRef }) {
  return notificationRepo.create({ userId, title, body, type, linkRef });
}

module.exports = { listForUser, markRead, markAllRead, notify };
