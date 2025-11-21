const Alert = require('../models/Alert');
const User = require('../models/User');
const { hashIP } = require('../utils/encryption');

exports.createAlert = async (req, res) => {
  try {
    const {
      type,
      severity,
      location,
      description,
      media = [],
      visibility = 'public'
    } = req.body;

    // Create new alert
    const alert = new Alert({
      type,
      severity,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      description: description.trim(),
      anonymousUserId: req.user.anonymousId,
      media,
      visibility,
      metadata: {
        deviceInfo: req.headers['user-agent'],
        appVersion: req.headers['x-app-version'],
        ipHash: hashIP(req.ip)
      }
    });

    await alert.save();

    // Broadcast to nearby users via Socket.io
    const io = req.app.get('io');
    io.to('alerts').emit('new_alert', {
      alertId: alert.alertId,
      type: alert.type,
      location: alert.location,
      severity: alert.severity,
      description: alert.description,
      createdAt: alert.createdAt
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
};

exports.getAlerts = async (req, res) => {
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
};

exports.getAlertById = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOne({ alertId })
      .select('-anonymousUserId -metadata');

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    res.json({
      success: true,
      data: alert
    });

  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alert'
    });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOne({ alertId });

    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    // Check if user owns the alert
    if (alert.anonymousUserId !== req.user.anonymousId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this alert'
      });
    }

    await Alert.deleteOne({ alertId });

    res.json({
      success: true,
      data: { message: 'Alert deleted successfully' }
    });

  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete alert'
    });
  }
};