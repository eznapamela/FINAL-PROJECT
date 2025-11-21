// models/Alert.js - Crisis Alert System
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
    default: () => `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  type: {
    type: String,
    required: true,
    enum: [
      'violence',
      'arrest',
      'medical',
      'checkpoint',
      'safe_zone',
      'danger_zone',
      'internet_shutdown',
      'other'
    ]
  },

  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: String,
    accuracy: { type: Number, default: 100 }
  },

  description: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },

  anonymousUserId: {
    type: String,
    required: true,
    ref: 'User'
  },

  media: [{
    filename: String,
    encryptedUrl: String,
    hash: String,
    mimeType: String,
    size: Number
  }],

  verification: {
    count: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    verifiedAt: Date
  },

  visibility: {
    type: String,
    enum: ['public', 'verified_only', 'private'],
    default: 'public'
  },

  expiresAt: {
    type: Date,
    default: function () {
      return new Date(Date.now() + 24 * 60 * 60 * 1000);
    },
    index: { expires: 0 } // keep ONLY this index
  },

  metadata: {
    deviceInfo: String,
    appVersion: String,
    ipHash: String
  }

}, {
  timestamps: true // creates createdAt & updatedAt
});

// --- INDEXES (unique ones only) ---
alertSchema.index({ location: '2dsphere' });
alertSchema.index({ type: 1, severity: 1 });

module.exports = mongoose.model("Alert", alertSchema);
