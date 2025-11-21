// models/SystemConfig.js - Application Configuration
const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  type: {
    type: String,
    enum: ['string', 'number', 'boolean', 'array', 'object'],
    required: true
  },
  description: String,
  isPublic: { type: Boolean, default: false },
  updatedBy: String
}, {
  timestamps: true
});

// Default configurations
const defaultConfigs = [
  {
    key: 'autoDeleteHours',
    value: 24,
    type: 'number',
    description: 'Auto-delete alerts after hours'
  },
  {
    key: 'maxAlertRadius',
    value: 50,
    type: 'number',
    description: 'Maximum radius for alert visibility in km'
  },
  {
    key: 'verificationThreshold',
    value: 3,
    type: 'number',
    description: 'Minimum verifications for auto-confirmation'
  },
  {
    key: 'sosBroadcastRadius',
    value: 10,
    type: 'number',
    description: 'Default SOS broadcast radius in km'
  }
];

module.exports = {
  SystemConfig: mongoose.model("SystemConfig", systemConfigSchema),
  defaultConfigs
};
