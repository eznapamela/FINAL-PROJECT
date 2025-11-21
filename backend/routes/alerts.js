// server/routes/alerts.js
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Alert = require('../models/Alert');
const anonymousAuth = require('../middleware/anonymousAuth.js');

// Rate limiting
const alertLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: {
    error: 'Too many alert submissions, please try again later.'
  }
});

// @route   POST /api/alerts
// @desc    Create new alert
// @access  Public (with anonymous auth)
router.post('/', anonymousAuth, alertLimiter, async (req, res) => {
  try {
    const {
      type,
      severity,
      location,
      description,
      media,
      visibility
    } = req.body;

    // Validate location
    if (!location || !location.coordinates) {
      return res.status(400).json({
        success: false,
        error: 'Valid location coordinates are required'
      });
    }

    const alert = new Alert({
      type,
      severity,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      description: description.trim(),
      anonymousUserId: req.anonymousUser.anonymousId,
      media: media || [],
      visibility: visibility || 'public',
      metadata: {
        deviceInfo: req.headers['user-agent'],
        appVersion: req.headers['x-app-version'],
        ipHash: hashIP(req.ip)
      }
    });

    await alert.save();

    // Broadcast to nearby users via Socket.io
    req.app.get('io').to('alerts').emit('new_alert', {
      alertId: alert.alertId,
      type: alert.type,
      location: alert.location,
      severity: alert.severity
    });

    res.status(201).json({
      success: true,
      data: {
        alertId: alert.alertId,
        type: alert.type,
        severity: alert.severity,
        createdAt: alert.createdAt
      }
    });

  } catch (error) {
    console.error('Alert creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create alert'
    });
  }
});

// @route   GET /api/alerts
// @desc    Get alerts with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      lat,
      lng,
      radius = 10,
      types,
      severity,
      page = 1,
      limit = 20
    } = req.query;

    let query = { expiresAt: { $gt: new Date() } };

    // Location-based filtering
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert km to meters
        }
      };
    }

    // Type filtering
    if (types) {
      query.type = { $in: types.split(',') };
    }

    // Severity filtering
    if (severity) {
      query.severity = severity;
    }

    const alerts = await Alert.find(query)
      .select('-anonymousUserId -metadata')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Alert.countDocuments(query);

    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    });
  }
});

module.exports = router;