// backend/src/services/ticket.service.js
const ticketRepo = require('../repositories/ticket.repository');
const { slaTargetHours } = require('../utils/slaCalculator.util');

function generateTicketRef() {
  return `#ZD-${Math.floor(10000 + Math.random() * 89999)}`;
}

async function listTickets(vendorId, filter = {}) {
  return ticketRepo.findByVendor(vendorId, filter);
}

async function getTicket(ticketRef) {
  const ticket = await ticketRepo.findByRef(ticketRef);
  if (!ticket) throw Object.assign(new Error('Ticket not found'), { statusCode: 404 });
  return ticket;
}

async function createTicket(data) {
  const ticketRef = generateTicketRef();
  const result = await ticketRepo.create({
    ...data,
    ticketRef,
    status: 'open',
    openedAt: new Date(),
    resolvedAt: null,
    slaTargetHours: slaTargetHours(data.priority),
  });
  return { _id: result.insertedId, ticketRef };
}

async function addTimelineEntry(ticketRef, entry, byUserId) {
  await getTicket(ticketRef); // 404s if missing
  await ticketRepo.addTimelineEntry(ticketRef, { ...entry, byUserId, at: new Date() });
}

async function updateStatus(ticketRef, status) {
  await getTicket(ticketRef);
  await ticketRepo.updateStatus(ticketRef, status);
}

async function resolveTicket(ticketRef, { engineer, branchManager, notes }, file) {
  await getTicket(ticketRef);

  const closureReport = {
    fileUrl: file ? `/uploads/closure-reports/${file.filename}` : '',
    engineer,
    branchManager,
    notes: notes || '',
    uploadedAt: new Date(),
  };

  await ticketRepo.resolve(ticketRef, closureReport);
  return closureReport;
}

module.exports = { listTickets, getTicket, createTicket, addTimelineEntry, updateStatus, resolveTicket };
