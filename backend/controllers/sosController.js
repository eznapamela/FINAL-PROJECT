const SOSRequest = require('../models/SOSRequest');
const { hashIP } = require('../utils/encryption');

exports.createSOS = async (req, res) => {
  try {
    const {
      emergencyType,
      location,
      details = {},
      broadcastRadius = 5
    } = req.body;

    const sos = new SOSRequest({
      anonymousUserId: req.user.anonymousId,
      emergencyType,
      location: {
        type: 'Point',
        coordinates: location.coordinates
      },
      details,
      broadcastRadius,
      priority: emergencyType === 'life_threatening' ? 'critical' : 'high',
      metadata: {
        deviceInfo: req.headers['user-agent'],
        ipHash: hashIP(req.ip)
      }
    });

    await sos.save();

    // Emergency broadcast via Socket.io
    const io = req.app.get('io');
    io.to('emergency').emit('sos_alert', {
      sosId: sos.sosId,
      emergencyType: sos.emergencyType,
      location: sos.location,
      priority: sos.priority,
      details: sos.details,
      timestamp: sos.createdAt
    });

    // Broadcast to location-based rooms
    const [lng, lat] = sos.location.coordinates;
    const locationRoom = `location_${Math.round(lat * 100)}_${Math.round(lng * 100)}`;
    io.to(locationRoom).emit('sos_nearby', {
      sosId: sos.sosId,
      emergencyType: sos.emergencyType,
      distance: 0, // Same location
      priority: sos.priority
    });

    res.status(201).json({
      success: true,
      data: {
        sosId: sos.sosId,
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
};

exports.getNearbySOS = async (req, res) => {
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
};

exports.respondToSOS = async (req, res) => {
  try {
    const { sosId } = req.params;
    const { responseType, additionalInfo } = req.body;

    const sos = await SOSRequest.findOne({ sosId, status: 'active' });

    if (!sos) {
      return res.status(404).json({
        success: false,
        error: 'SOS alert not found or no longer active'
      });
    }

    // Add responder to the list
    sos.responders.push({
      anonymousUserId: req.user.anonymousId,
      responseType,
      timestamp: new Date()
    });

    await sos.save();

    // Notify the SOS creator about the response
    const io = req.app.get('io');
    io.emit('sos_response', {
      sosId: sos.sosId,
      responseType,
      responderCount: sos.responders.length
    });

    res.json({
      success: true,
      data: {
        message: 'Response recorded successfully',
        responderCount: sos.responders.length
      }
    });

  } catch (error) {
    console.error('SOS response error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record response'
    });
  }
};

exports.updateSOSStatus = async (req, res) => {
  try {
    const { sosId } = req.params;
    const { status } = req.body;

    const sos = await SOSRequest.findOne({ sosId });

    if (!sos) {
      return res.status(404).json({
        success: false,
        error: 'SOS alert not found'
      });
    }

    // Only allow creator or high-trust users to update status
    if (sos.anonymousUserId !== req.user.anonymousId && req.user.trustScore < 70) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this SOS'
      });
    }

    sos.status = status;
    await sos.save();

    // Broadcast status update
    const io = req.app.get('io');
    io.emit('sos_status_update', {
      sosId: sos.sosId,
      status: sos.status
    });

    res.json({
      success: true,
      data: {
        status: sos.status,
        updatedAt: sos.updatedAt
      }
    });

  } catch (error) {
    console.error('SOS status update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update SOS status'
    });
  }
};