const User = require('../models/User');

const authenticateAnonymous = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const user = await User.findOne({ 
      anonymousId: token, 
      isActive: true 
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const user = await User.findOne({ 
        anonymousId: token, 
        isActive: true 
      });
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = { authenticateAnonymous, optionalAuth };