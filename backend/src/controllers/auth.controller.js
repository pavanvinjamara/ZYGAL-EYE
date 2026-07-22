// backend/src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { ok, created, fail } = require('../utils/apiResponse.util');

async function loginVendor(req, res) {
  try {
    const { email, password, vendorShortCode } = req.body;
    const { token, refreshToken, user } = await authService.loginVendor(
      { email, password, vendorShortCode },
      { userAgent: req.headers['user-agent'], ip: req.ip }
    );
    return ok(res, { accessToken: token, refreshToken, user });
  } catch (err) {
    return fail(res, err);
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, user } = await authService.loginAdmin(
      { email, password },
      { userAgent: req.headers['user-agent'], ip: req.ip }
    );
    return ok(res, { accessToken: token, refreshToken, user });
  } catch (err) {
    return fail(res, err);
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    const { token } = await authService.refresh(refreshToken);
    return ok(res, { accessToken: token });
  } catch (err) {
    return fail(res, err);
  }
}

async function logout(req, res) {
  try {
    await authService.logout(req.body.refreshToken);
    return ok(res, { message: 'Logged out' });
  } catch (err) {
    return fail(res, err);
  }
}

async function me(req, res) {
  try {
    const user = await authService.getMe(req.user.sub);
    return ok(res, user);
  } catch (err) {
    return fail(res, err);
  }
}

async function register(req, res) {
  try {
    const { name, email, password, role, vendorId } = req.body;
    const result = await authService.register(
      { name, email, password, role, vendorId },
      req.user?.sub || null,
      { ip: req.ip }
    );
    return created(res, { _id: result._id, message: 'Registered. Awaiting activation.' });
  } catch (err) {
    return fail(res, err);
  }
}

async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(req.user.sub, oldPassword, newPassword);
    return ok(res, { message: 'Password updated' });
  } catch (err) {
    return fail(res, err);
  }
}

module.exports = { loginVendor, loginAdmin, refresh, logout, me, register, changePassword };