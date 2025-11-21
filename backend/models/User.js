// models/User.js - Anonymous User Profile
const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
    unique: true,
    default: () => crypto.randomBytes(16).toString('hex')
  },
  deviceFingerprint: {
    type: String,
    required: true,
    index: true
  },
  lastKnownLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    timestamp: Date
  },
  preferences: {
    autoDeleteHours: { type: Number, default: 24, min: 1, max: 168 },
    darkMode: { type: Boolean, default: false },
    panicWipeEnabled: { type: Boolean, default: true },
    notificationRadius: { type: Number, default: 10 }
  },
  trustScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ lastKnownLocation: '2dsphere' });

// TTL index for auto-delete after 7 days
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

module.exports = mongoose.model("User", userSchema);
