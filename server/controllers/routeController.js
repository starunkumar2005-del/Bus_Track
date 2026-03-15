/**
 * Route Controller
 */
const Route = require('../models/Route');
const { v4: uuidv4 } = require('uuid');

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ error: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const { routeName, routeNumber, waypoints, stops } = req.body;

    const route = new Route({
      routeId: uuidv4(),
      routeName,
      routeNumber,
      waypoints,
      stops,
      totalDistance: calculateRouteDistance(waypoints),
      estimatedDuration: calculateRouteDuration(waypoints),
    });

    await route.save();
    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Helper: Calculate route distance in km
 */
function calculateRouteDistance(waypoints) {
  if (!waypoints || waypoints.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const d = haversineDistance(
      waypoints[i].latitude,
      waypoints[i].longitude,
      waypoints[i + 1].latitude,
      waypoints[i + 1].longitude
    );
    totalDistance += d;
  }

  return totalDistance;
}

/**
 * Helper: Calculate route duration in minutes (assuming average 40 km/h)
 */
function calculateRouteDuration(waypoints) {
  const distance = calculateRouteDistance(waypoints);
  const speedKmh = 40;
  return Math.round((distance / speedKmh) * 60);
}

/**
 * Helper: Haversine formula for distance calculation
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
