// server/routes/verification.js
const express = require('express');
const router = express.Router();

// @route   POST /api/verify/alert/:alertId
// @desc    Verify or deny an alert
// @access  Public
router.post('/alert/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { verificationType, confidence, additionalInfo, location } = req.body;

    const alert = await Alert.findOne({ alertId });
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    // Check if user already verified this alert
    const existingVerification = await Verification.findOne({
      alertId: alert._id,
      anonymousUserId: req.anonymousUser.anonymousId
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        error: 'You have already verified this alert'
      });
    }

    const verification = new Verification({
      alertId: alert._id,
      anonymousUserId: req.anonymousUser.anonymousId,
      verificationType,
      confidence,
      additionalInfo,
      locationAtTime: location ? {
        type: 'Point',
        coordinates: location.coordinates
      } : undefined
    });

    await verification.save();

    // Update alert verification count
    const verifyCount = await Verification.countDocuments({
      alertId: alert._id,
      verificationType: 'confirm'
    });

    const verificationThreshold = await SystemConfig.findOne({ 
      key: 'verificationThreshold' 
    });

    if (verifyCount >= (verificationThreshold?.value || 3)) {
      alert.verification.verified = true;
      alert.verification.verifiedAt = new Date();
      await alert.save();
    }

    alert.verification.count = verifyCount;
    await alert.save();

    res.json({
      success: true,
      data: {
        verificationId: verification._id,
        alertVerified: alert.verification.verified,
        currentVerifications: verifyCount
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process verification'
    });
  }
});

module.exports = router;