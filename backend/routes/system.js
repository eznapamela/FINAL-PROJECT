const express = require('express');
const router = express.Router();
const { authenticateAnonymous } = require('../middleware/auth');
const SystemConfig = require('../models/SystemConfig');

// Get system configuration
router.get('/config', async (req, res) => {
  try {
    const configs = await SystemConfig.find({ isPublic: true });
    
    const configObject = {};
    configs.forEach(config => {
      configObject[config.key] = config.value;
    });

    res.json({
      success: true,
      data: configObject
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system configuration'
    });
  }
});

// Update user preferences
router.put('/preferences', authenticateAnonymous, async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Update user preferences in the database
    const User = require('../models/User');
    await User.findOneAndUpdate(
      { anonymousId: req.user.anonymousId },
      { $set: { preferences } }
    );

    res.json({
      success: true,
      data: { message: 'Preferences updated successfully' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    }
  });
});

// Statistics endpoint
router.get('/stats', async (req, res) => {
  try {
    const Alert = require('../models/Alert');
    const SOSRequest = require('../models/SOSRequest');
    const MissingPerson = require('../models/MissingPerson');

    const [
      totalAlerts,
      activeSOS,
      missingCases,
      verifiedAlerts
    ] = await Promise.all([
      Alert.countDocuments({ expiresAt: { $gt: new Date() } }),
      SOSRequest.countDocuments({ status: 'active', expiresAt: { $gt: new Date() } }),
      MissingPerson.countDocuments({ status: 'missing', expiresAt: { $gt: new Date() } }),
      Alert.countDocuments({ 'verification.verified': true, expiresAt: { $gt: new Date() } })
    ]);

    res.json({
      success: true,
      data: {
        totalAlerts,
        activeSOS,
        missingCases,
        verifiedAlerts,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;