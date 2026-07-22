// backend/src/controllers/ticket.controller.js
const ticketService = require('../services/ticket.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function list(req, res) {
  try {
    const { status, priority } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    return ok(res, await ticketService.listTickets(req.params.vendorId, filter));
  } catch (err) {
    return fail(res, err);
  }
}

async function get(req, res) {
  try {
    return ok(res, await ticketService.getTicket(req.params.ticketRef));
  } catch (err) {
    return fail(res, err);
  }
}

async function create(req, res) {
  try {
    const result = await ticketService.createTicket(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function addTimelineEntry(req, res) {
  try {
    await ticketService.addTimelineEntry(req.params.ticketRef, req.body, req.user.sub);
    return ok(res, { message: 'Timeline updated' });
  } catch (err) {
    return fail(res, err);
  }
}

async function updateStatus(req, res) {
  try {
    await ticketService.updateStatus(req.params.ticketRef, req.body.status);
    return ok(res, { message: 'Status updated' });
  } catch (err) {
    return fail(res, err);
  }
}

async function resolve(req, res) {
  try {
    const closureReport = await ticketService.resolveTicket(req.params.ticketRef, req.body, req.file);
    return ok(res, { message: 'Ticket resolved', closureReport });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { list, get, create, addTimelineEntry, updateStatus, resolve };
