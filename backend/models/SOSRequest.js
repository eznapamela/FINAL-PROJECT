// models/SOSRequest.js - Emergency SOS System
const mongoose = require("mongoose");
const sosSchema = new mongoose.Schema({
  sosId: {
    type: String,
    required: true,
    unique: true,
    default: () => `sos_${Date.now()}`
  },
  anonymousUserId: {
    type: String,
    required: true,
    ref: 'User'
  },
  emergencyType: {
    type: String,
    required: true,
    enum: [
      'violence_immediate',
      'medical_emergency',
      'arrest_in_progress',
      'trapped_location',
      'life_threatening'
    ]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    accuracy: Number
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled', 'expired'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['high', 'critical'],
    default: 'high'
  },
  details: {
    numberOfPeople: { type: Number, min: 1, max: 100 },
    immediateDanger: Boolean,
    medicalNeeds: [String],
    escapeRoutes: [String]
  },
  responders: [{
    anonymousUserId: String,
    responseType: String,
    timestamp: Date
  }],
  broadcastRadius: { type: Number, default: 5 }, // km
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
  }
}, {
  timestamps: true
});

sosSchema.index({ location: '2dsphere' });
sosSchema.index({ status: 1, priority: 1 });
sosSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });