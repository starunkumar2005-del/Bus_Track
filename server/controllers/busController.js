/**
 * Bus Controller
 */
const Bus = require('../models/Bus');
const { v4: uuidv4 } = require('uuid');

exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().populate('assignedRoute');
    res.json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate('assignedRoute');
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBus = async (req, res) => {
  try {
    const { busNumber, busType, capacity, driverName, phone } = req.body;

    const bus = new Bus({
      busId: uuidv4(),
      busNumber,
      busType,
      capacity,
      driverName,
      phone,
      status: 'idle',
    });

    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    ).populate('assignedRoute');
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusLocation = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    
    res.json({
      busId: bus._id,
      busNumber: bus.busNumber,
      position: bus.currentPosition,
      status: bus.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignBusToRoute = async (req, res) => {
  try {
    const { routeId } = req.body;
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      { assignedRoute: routeId, status: 'running' },
      { new: true }
    ).populate('assignedRoute');
    
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bus deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
