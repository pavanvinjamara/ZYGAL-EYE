const authService = require('../services/auth.service');

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

async function login(req, res, next) {
  try {
    const { vendorCode, email, password } = req.body;

    const result = await authService.login(
      { vendorCode, email, password },
      { userAgent: req.headers['user-agent'], ip: req.ip }
    );

    res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const result = await authService.refresh(token);
    return res.status(200).json({ success: true, accessToken: result.accessToken });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) await authService.logout(token);

    res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, refresh, logout };