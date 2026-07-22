// backend/src/middleware/validate.middleware.js
const { fail } = require('../utils/apiResponse.util');

/**
 * Validates part of the request (body/query/params) against a Joi schema.
 * Usage: router.post('/', validate(vendorValidator.onboard), ctrl.onboard)
 */
function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return fail(res, { statusCode: 422, message: 'Validation failed', details });
    }

    req[property] = value;
    return next();
  };
}

module.exports = { validate };
