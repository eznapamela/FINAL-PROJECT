const express = require('express');
const router = express.Router();
const { authenticateAnonymous } = require('../middleware/auth');
const MissingPerson = require('../models/MissingPerson');

// Get missing persons cases
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 50, status = 'missing' } = req.query;

    let query = { status, expiresAt: { $gt: new Date() } };

    // Location-based filtering
    if (lat && lng) {
      query['lastSeen.location'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000
        }
      };
    }

    const cases = await MissingPerson.find(query)
      .select('-contactInfo')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: cases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch missing persons cases'
    });
  }
});

// Create missing person case
router.post('/', authenticateAnonymous, async (req, res) => {
  try {
    const {
      personDetails,
      lastSeen,
      contactInfo,
      searchRadius = 10
    } = req.body;

    const missingPerson = new MissingPerson({
      reportedBy: req.user.anonymousId,
      personDetails,
      lastSeen: {
        location: {
          type: 'Point',
          coordinates: lastSeen.coordinates
        },
        timestamp: new Date(lastSeen.timestamp),
        address: lastSeen.address,
        circumstances: lastSeen.circumstances
      },
      contactInfo: contactInfo ? {
        encryptedContact: contactInfo,
        relationship: 'reporter'
      } : undefined,
      searchRadius
    });

    await missingPerson.save();

    res.status(201).json({
      success: true,
      data: {
        caseId: missingPerson.caseId,
        message: 'Missing person case created successfully'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create missing person case'
    });
  }
});

// Update case status
router.put('/:caseId', authenticateAnonymous, async (req, res) => {
  try {
    const { caseId } = req.params;
    const { status, additionalInfo } = req.body;

    const missingPerson = await MissingPerson.findOne({ caseId });
    if (!missingPerson) {
      return res.status(404).json({
        success: false,
        error: 'Case not found'
      });
    }

    // Only allow reporter or verified users to update
    if (missingPerson.reportedBy !== req.user.anonymousId && req.user.trustScore < 80) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this case'
      });
    }

    missingPerson.status = status;
    if (additionalInfo) {
      missingPerson.media.push({
        type: 'description',
        data: additionalInfo,
        isPublic: true
      });
    }

    await missingPerson.save();

    res.json({
      success: true,
      data: {
        status: missingPerson.status,
        updatedAt: missingPerson.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update case'
    });
  }
});

module.exports = router;