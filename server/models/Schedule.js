/**
 * Schedule Model
 * Represents bus schedules
 */
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  scheduleId: {
    type: String,
    unique: true,
    required: true,
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  
  // Daily schedule
  daysOfWeek: [
    {
      type: String,
      enum: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
    },
  ],
  
  // Trip timings
  trips: [
    {
      tripId: String,
      startTime: String, // HH:MM format
      endTime: String,
      startStopIndex: Number,
      endStopIndex: Number,
      status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
      },
    },
  ],
  
  // Frequency info
  frequency: { type: Number, default: 30 }, // minutes between trips
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
