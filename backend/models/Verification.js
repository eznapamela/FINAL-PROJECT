const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
  alertId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Alert'
  },
  anonymousUserId: {
    type: String,
    required: true,
    ref: 'User'
  },
  verificationType: {
    type: String,
    required: true,
    enum: ['confirm', 'deny', 'update']
  },
  confidence: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  additionalInfo: {
    type: String,
    maxlength: 200
  },
  locationAtTime: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: [Number]
  },
  isTrusted: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes
verificationSchema.index({ alertId: 1, anonymousUserId: 1 }, { unique: true });
verificationSchema.index({ locationAtTime: '2dsphere' }); // optional spatial queries

module.exports = mongoose.model("Verification", verificationSchema);
