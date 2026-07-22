// backend/src/controllers/onboarding.controller.js
const onboardingService = require('../services/onboarding.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function vendorDetailsStep(req, res) {
  try {
    const result = await onboardingService.vendorDetailsStep(req.body);
    return created(res, result);
  } catch (err) {
    return fail(res, err);
  }
}

async function contactStep(req, res) {
  try {
    await onboardingService.contactStep(req.body);
    return ok(res, { message: 'Contact saved' });
  } catch (err) {
    return fail(res, err);
  }
}

async function siteAllocationStep(req, res) {
  try {
    const result = await onboardingService.siteAllocationStep(req.body);
    return ok(res, { message: `${result.allocated} branch(es) allocated` });
  } catch (err) {
    return fail(res, err);
  }
}

async function reviewActivateStep(req, res) {
  try {
    await onboardingService.reviewActivateStep(req.body, req.user.sub, { ip: req.ip });
    return ok(res, { message: 'Vendor onboarded and activated' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { vendorDetailsStep, contactStep, siteAllocationStep, reviewActivateStep };
