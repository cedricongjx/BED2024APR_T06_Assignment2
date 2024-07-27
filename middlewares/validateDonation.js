const { body, validationResult } = require('express-validator');

// Middleware array to validate donation input fields
const validateDonation = [
  // Validate 'firstName' field
  body('firstName')
    .isString() // Check if 'firstName' is a string
    .notEmpty() // Check if 'firstName' is not empty
    .withMessage('First name is required and must be a string'), // Custom error message if validation fails

  // Validate 'amount' field
  body('amount')
    .isFloat({ gt: 0 }) // Check if 'amount' is a float greater than 0
    .withMessage('Amount must be a positive number'), // Custom error message if validation fails

  // Validate 'donationType' field
  body('donationType')
    .isIn(['one-time', 'monthly']) // Check if 'donationType' is either 'one-time' or 'monthly'
    .withMessage('Invalid donation type'), // Custom error message if validation fails

  // Validate 'months' field (optional)
  body('months')
    .optional() // 'months' is optional
    .isInt({ gt: 0 }) // Check if 'months' is an integer greater than 0 if provided
    .withMessage('Months must be a positive integer'), // Custom error message if validation fails

  // Middleware to handle validation result
  (req, res, next) => {
    // Gather validation results
    const errors = validationResult(req);
    // If there are validation errors, respond with 400 status and error messages
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // If no validation errors, proceed to the next middleware or route handler
    next();
  }
];

module.exports = validateDonation;
