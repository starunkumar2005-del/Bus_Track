/**
 * Route Model
 * Represents a bus route with stops and waypoints
 */
const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    unique: true,
    required: true,
  },
  routeName: {
    type: String,
    required: true,
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  
  // Route path consists of waypoints (intermediate coordinates)
  waypoints: [
    {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      order: Number,
    },
  ],
  
  // Stops where buses halt
  stops: [
    {
      stopId: String,
      stopName: String,
      latitude: Number,
      longitude: Number,
      stopOrder: Number,
      dwellTime: { type: Number, default: 180000 }, // milliseconds
    },
  ],
  
  // Route metrics
  totalDistance: Number, // in km
  estimatedDuration: Number, // in minutes
  
  // Status
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Route', routeSchema);
