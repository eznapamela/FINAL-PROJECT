const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Alert-specific limits
const alertLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests per window
  'Too many alert submissions. Please try again later.'
);

// SOS emergency limits
const sosLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  10, // 10 SOS requests per window
  'Too many SOS requests. Please contact emergency services directly.'
);

// General API limits
const apiLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP. Please try again later.'
);

// Verification limits
const verificationLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  30, // 30 verifications per window
  'Too many verification attempts. Please try again later.'
);

module.exports = {
  alertLimiter,
  sosLimiter,
  apiLimiter,
  verificationLimiter
};