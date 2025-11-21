const Verification = require('../models/Verification');
const Alert = require('../models/Alert');
const User = require('../models/User');

exports.verifyAlert = async (req, res) => {
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
      anonymousUserId: req.user.anonymousId
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        error: 'You have already verified this alert'
      });
    }

    const verification = new Verification({
      alertId: alert._id,
      anonymousUserId: req.user.anonymousId,
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

    const denyCount = await Verification.countDocuments({
      alertId: alert._id,
      verificationType: 'deny'
    });

    // Auto-verify if enough confirmations
    const SystemConfig = require('../models/SystemConfig');
    const verificationThreshold = await SystemConfig.findOne({ 
      key: 'verificationThreshold' 
    });

    const threshold = verificationThreshold?.value || 3;

    if (verifyCount >= threshold && verifyCount > denyCount * 2) {
      alert.verification.verified = true;
      alert.verification.verifiedAt = new Date();
    }

    alert.verification.count = verifyCount - denyCount;
    await alert.save();

    // Update user trust score
    await updateUserTrustScore(req.user.anonymousId);

    // Broadcast verification update
    const io = req.app.get('io');
    io.emit('alert_verified', {
      alertId: alert.alertId,
      verificationCount: alert.verification.count,
      verified: alert.verification.verified
    });

    res.json({
      success: true,
      data: {
        verificationId: verification._id,
        alertVerified: alert.verification.verified,
        currentVerifications: alert.verification.count
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process verification'
    });
  }
};

exports.getAlertVerifications = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await Alert.findOne({ alertId });
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: 'Alert not found'
      });
    }

    const verifications = await Verification.find({ alertId: alert._id })
      .select('-anonymousUserId')
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      confirmations: await Verification.countDocuments({
        alertId: alert._id,
        verificationType: 'confirm'
      }),
      denials: await Verification.countDocuments({
        alertId: alert._id,
        verificationType: 'deny'
      }),
      updates: await Verification.countDocuments({
        alertId: alert._id,
        verificationType: 'update'
      })
    };

    res.json({
      success: true,
      data: {
        verifications,
        stats,
        alertVerified: alert.verification.verified
      }
    });

  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verifications'
    });
  }
};

const updateUserTrustScore = async (anonymousUserId) => {
  try {
    const user = await User.findOne({ anonymousUserId });
    if (!user) return;

    // Calculate user's verification accuracy
    const userVerifications = await Verification.find({ anonymousUserId });
    
    const helpfulVerifications = userVerifications.filter(v => 
      v.verificationType === 'confirm' || v.verificationType === 'deny'
    ).length;

    const userAlerts = await Alert.find({ anonymousUserId });
    const verifiedAlerts = userAlerts.filter(a => a.verification.verified).length;

    // Simple trust score calculation
    let trustScore = 50; // Base score
    
    // Positive factors
    trustScore += Math.min(helpfulVerifications * 2, 20);
    trustScore += Math.min(verifiedAlerts * 5, 25);
    
    // Ensure score stays within bounds
    trustScore = Math.max(0, Math.min(100, trustScore));

    user.trustScore = trustScore;
    await user.save();

  } catch (error) {
    console.error('Trust score update error:', error);
  }
};