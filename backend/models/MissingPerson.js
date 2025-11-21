// models/MissingPerson.js - Missing Persons Registry
const mongoose = require('mongoose');
const missingPersonSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
    default: () => `case_${Date.now()}`
  },
  reportedBy: {
    type: String,
    required: true,
    ref: 'User'
  },
  personDetails: {
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 1, max: 120 },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    physicalDescription: String,
    lastSeenClothing: String,
    distinguishingFeatures: [String]
  },
  lastSeen: {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: [Number]
    },
    timestamp: { type: Date, required: true },
    address: String,
    circumstances: String
  },
  status: {
    type: String,
    enum: ['missing', 'found', 'search_ongoing'],
    default: 'missing'
  },
  contactInfo: {
    encryptedContact: String,
    relationship: String
  },
  media: [{
    type: { type: String, enum: ['photo', 'description'] },
    data: String,
    isPublic: { type: Boolean, default: false }
  }],
  searchRadius: { type: Number, default: 10 }, // km
  isVerified: { type: Boolean, default: false },
  verifiedBy: [String], // trusted user IDs
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

missingPersonSchema.index({ 'lastSeen.location': '2dsphere' });
missingPersonSchema.index({ status: 1, isVerified: 1 });

module.exports = mongoose.model("MissingPerson", missingPersonSchema);