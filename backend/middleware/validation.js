const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const alertValidation = [
  body('type')
    .isIn(['violence', 'arrest', 'medical', 'checkpoint', 'safe_zone', 'danger_zone', 'internet_shutdown', 'other'])
    .withMessage('Invalid alert type'),
  body('severity')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  body('description')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [lng, lat]'),
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),
  handleValidationErrors
];

const sosValidation = [
  body('emergencyType')
    .isIn(['violence_immediate', 'medical_emergency', 'arrest_in_progress', 'trapped_location', 'life_threatening'])
    .withMessage('Invalid emergency type'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be an array of [lng, lat]'),
  body('broadcastRadius')
    .isInt({ min: 1, max: 50 })
    .withMessage('Broadcast radius must be between 1 and 50 km'),
  handleValidationErrors
];

const verificationValidation = [
  body('verificationType')
    .isIn(['confirm', 'deny', 'update'])
    .withMessage('Invalid verification type'),
  body('confidence')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid confidence level'),
  handleValidationErrors
];

module.exports = {
  alertValidation,
  sosValidation,
  verificationValidation,
  handleValidationErrors
};