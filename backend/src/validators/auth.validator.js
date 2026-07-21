const { body, validationResult } = require('express-validator');

const loginValidator = [
  body('vendorCode').isString().trim().notEmpty().withMessage('Vendor is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerValidator = [
  body('vendorCode').isString().trim().notEmpty().withMessage('Vendor is required'),
  body('name').isString().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().isString(),
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
}

module.exports = { loginValidator, registerValidator, handleValidation };