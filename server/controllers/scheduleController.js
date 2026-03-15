/**
 * Schedule Controller
 */
const Schedule = require('../models/Schedule');
const { v4: uuidv4 } = require('uuid');

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('bus').populate('route');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id)
      .populate('bus')
      .populate('route');
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ bus: req.params.busId })
      .populate('bus')
      .populate('route');
    if (!schedule) return res.status(404).json({ error: 'No schedule found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { bus, route, daysOfWeek, trips, frequency } = req.body;

    const schedule = new Schedule({
      scheduleId: uuidv4(),
      bus,
      route,
      daysOfWeek,
      trips: trips.map(t => ({ ...t, tripId: uuidv4() })),
      frequency,
    });

    await schedule.save();
    const populated = await schedule.populate('bus').populate('route');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    )
      .populate('bus')
      .populate('route');
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
