// routes/sos.js
const express = require('express');
const router = express.Router();
const SOSRequest = require('../models/SOSRequest'); // You need this model
const anonymousAuth = require('../middleware/anonymousAuth'); // Add authentication

// Apply anonymousAuth middleware to all routes
router.use(anonymousAuth);

// @route   POST /api/sos
// @desc    Create emergency SOS
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      emergencyType,
      location,
      details,
      broadcastRadius
    } = req.body;

    // Validate required fields
    if (!emergencyType || !location || !location.coordinates) {
      return res.status(400).json({
        success: false,
        error: 'Emergency type and location coordinates are required'
      });
    }

    const sos = new SOSRequest({
      anonymousUserId: req.user._id, // Changed from req.anonymousUser.anonymousId
      emergencyType,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      details,
      broadcastRadius: broadcastRadius || 5,
      priority: emergencyType === 'life_threatening' ? 'critical' : 'high'
    });

    await sos.save();

    // Emergency broadcast (only if Socket.IO is available)
    if (req.app.get('io')) {
      req.app.get('io').to('emergency').emit('sos_alert', {
        sosId: sos._id, // Changed from sos.sosId
        emergencyType: sos.emergencyType,
        location: sos.location,
        priority: sos.priority,
        timestamp: sos.createdAt
      });
    }

    res.status(201).json({
      success: true,
      data: {
        sosId: sos._id, // Changed from sos.sosId
        message: 'SOS alert broadcasted successfully'
      }
    });

  } catch (error) {
    console.error('SOS creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create SOS alert'
    });
  }
});

// @route   GET /api/sos/nearby
// @desc    Get nearby SOS alerts
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Location coordinates required'
      });
    }

    const sosAlerts = await SOSRequest.find({
      status: 'active',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000
        }
      },
      expiresAt: { $gt: new Date() }
    }).sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      data: sosAlerts
    });

  } catch (error) {
    console.error('Get SOS alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch SOS alerts'
    });
  }
});

module.exports = router; 