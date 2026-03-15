/**
 * Stop Controller
 */
const Stop = require('../models/Stop');
const { v4: uuidv4 } = require('uuid');

exports.getAllStops = async (req, res) => {
  try {
    const stops = await Stop.find().populate('routes');
    res.json(stops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStopById = async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id).populate('routes');
    if (!stop) return res.status(404).json({ error: 'Stop not found' });
    res.json(stop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createStop = async (req, res) => {
  try {
    const { stopName, latitude, longitude, city } = req.body;

    const stop = new Stop({
      stopId: uuidv4(),
      stopName,
      latitude,
      longitude,
      city,
    });

    await stop.save();
    res.status(201).json(stop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStop = async (req, res) => {
  try {
    const stop = await Stop.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('routes');
    res.json(stop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStop = async (req, res) => {
  try {
    await Stop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stop deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
