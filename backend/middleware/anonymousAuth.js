// middleware/anonymousAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to handle both authenticated and anonymous users
 * If no valid token is provided, creates an anonymous user session
 */
const anonymousAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        // Verify the token for authenticated users
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id).select('-password');
        
        if (user) {
          req.user = user;
          req.isAnonymous = false;
          return next();
        }
      } catch (error) {
        // Token is invalid, continue as anonymous
        console.log('Invalid token, proceeding as anonymous user');
      }
    }
    
    // No valid token - create anonymous session
    req.user = {
      _id: generateAnonymousId(),
      isAnonymous: true,
      username: 'anonymous'
    };
    req.isAnonymous = true;
    
    next();
  } catch (error) {
    console.error('Anonymous auth error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

/**
 * Generate a unique anonymous user ID
 */
function generateAnonymousId() {
  return `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = anonymousAuth;