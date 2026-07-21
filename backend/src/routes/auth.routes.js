// src/routes/auth.routes.js
const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimit.middleware');
const {
  loginValidator,
  registerValidator,
  handleValidation,
} = require('../validators/auth.validator');

router.post('/login', loginLimiter, loginValidator, handleValidation, authController.login);
router.post('/register', registerValidator, handleValidation, authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

module.exports = router;