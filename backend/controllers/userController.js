const User = require('../models/User');
const { generateAnonymousId } = require('../utils/helpers');

exports.createAnonymousUser = async (req, res) => {
  try {
    const { deviceId } = req.body;
    
    const user = new User({
      anonymousId: generateAnonymousId(),
      deviceFingerprint: deviceId
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        anonymousId: user.anonymousId,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create anonymous user'
    });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const { anonymousId } = req.user;
    
    const user = await User.findOne({ anonymousId, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    res.json({
      success: true,
      data: { valid: true }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token validation failed'
    });
  }
};

exports.updateUserPreferences = async (req, res) => {
  try {
    const { anonymousId } = req.user;
    const { preferences } = req.body;

    const user = await User.findOneAndUpdate(
      { anonymousId },
      { $set: { preferences } },
      { new: true }
    );

    res.json({
      success: true,
      data: { preferences: user.preferences }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
};