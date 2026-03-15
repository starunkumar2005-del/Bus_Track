/**
 * Bus Model
 * Represents a physical bus in the system
 */
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    unique: true,
    required: true,
  },
  busNumber: {
    type: String,
    required: true,
    unique: true,
  },
  busType: {
    type: String,
    enum: ['AC', 'NON-AC', 'SEMI-AC'],
    default: 'NON-AC',
  },
  capacity: {
    type: Number,
    default: 50,
  },
  
  // Current assignment
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    default: null,
  },
  
  // Current position
  currentPosition: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  
  // Current status
  status: {
    type: String,
    enum: ['idle', 'running', 'stopped', 'maintenance'],
    default: 'idle',
  },
  
  // Route tracking
  currentRouteIndex: { type: Number, default: 0 }, // Index in route waypoints
  nextStopIndex: { type: Number, default: 0 },
  lastStopIndex: { type: Number, default: -1 },
  
  // Passenger info
  currentPassengers: { type: Number, default: 0 },
  
  // Registration info
  registrationNumber: String,
  driverName: String,
  phone: String,
  
  // Status tracking
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bus', busSchema);
