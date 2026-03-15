/**
 * Stop Model
 * Represents bus stops/stations
 */
const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    unique: true,
    required: true,
  },
  stopName: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  city: String,
  description: String,
  
  // Stop facilities
  hasShelter: { type: Boolean, default: false },
  hasBench: { type: Boolean, default: false },
  hasWater: { type: Boolean, default: false },
  hasToilet: { type: Boolean, default: false },
  
  // Routes passing through
  routes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
  ],
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stop', stopSchema);
