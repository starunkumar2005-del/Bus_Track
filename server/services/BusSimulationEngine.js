/**
 * Bus Simulation Engine
 * Handles real-time bus movement simulation based on routes and schedules
 * 
 * Algorithm:
 * 1. For each active bus:
 *    - Get current position and target waypoint
 *    - Calculate distance and bearing to next waypoint
 *    - Move bus incrementally (based on speed and time delta)
 *    - Check if bus reached stop/waypoint
 *    - If at stop: apply dwell time
 *    - Update database and emit WebSocket events
 */

const Bus = require('../models/Bus');
const Route = require('../models/Route');

class BusSimulationEngine {
  constructor(io) {
    this.io = io;
    this.activeBuses = new Map(); // busId -> busState
    this.updateInterval = null;
    
    // Configuration
    this.config = {
      speedKmh: 40,
      updateFrequencyMs: 2000,
      stopDwellTimeMs: 3000,
      trafficVariance: 0.2, // 20% variance in speed
    };
  }

  /**
   * Start the simulation engine
   */
  async start() {
    console.log('Starting Bus Simulation Engine...');
    
    // Load all active buses
    await this.loadActiveBuses();
    
    // Start update loop
    this.updateInterval = setInterval(async () => {
      await this.simulationTick();
    }, this.config.updateFrequencyMs);
  }

  /**
   * Stop the simulation engine
   */
  stop() {
    console.log('Stopping Bus Simulation Engine...');
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.activeBuses.clear();
  }

  /**
   * Load all active buses and their routes
   */
  async loadActiveBuses() {
    try {
      const buses = await Bus.find({ isActive: true }).populate('assignedRoute');
      
      for (const bus of buses) {
        if (bus.assignedRoute) {
          const busState = {
            busId: bus._id.toString(),
            busNumber: bus.busNumber,
            route: bus.assignedRoute,
            position: {
              lat: bus.assignedRoute.waypoints[0]?.latitude || 0,
              lng: bus.assignedRoute.waypoints[0]?.longitude || 0,
            },
            waypointIndex: 0,
            stopIndex: 0,
            atStop: false,
            stopTimeRemaining: 0,
            speed: 0,
            bearing: 0,
          };
          
          this.activeBuses.set(bus._id.toString(), busState);
        }
      }
      
      console.log(`Loaded ${this.activeBuses.size} active buses for simulation`);
    } catch (error) {
      console.error('Error loading active buses:', error);
    }
  }

  /**
   * Main simulation tick - updates all buses
   */
  async simulationTick() {
    for (const [busId, busState] of this.activeBuses) {
      try {
        await this.updateBusPosition(busId, busState);
      } catch (error) {
        console.error(`Error updating bus ${busId}:`, error);
      }
    }
  }

  /**
   * Update single bus position
   */
  async updateBusPosition(busId, busState) {
    const { route, position, waypointIndex, stopIndex } = busState;
    
    if (!route || !route.waypoints || route.waypoints.length === 0) {
      return;
    }

    // Handle stop dwell time
    if (busState.atStop && busState.stopTimeRemaining > 0) {
      busState.stopTimeRemaining -= this.config.updateFrequencyMs;
      if (busState.stopTimeRemaining <= 0) {
        busState.atStop = false;
        busState.stopTimeRemaining = 0;
        this.io.emit('bus_departed', {
          busId,
          busNumber: busState.busNumber,
          stopIndex,
          timestamp: new Date(),
        });
      }
      return;
    }

    // Get waypoints for movement
    if (waypointIndex >= route.waypoints.length - 1) {
      // Bus reached end of route, reset
      busState.waypointIndex = 0;
      busState.stopIndex = 0;
      return;
    }

    const currentWaypoint = route.waypoints[waypointIndex];
    const nextWaypoint = route.waypoints[waypointIndex + 1];

    // Calculate distance to next waypoint
    const distance = this.calculateDistance(
      position.lat,
      position.lng,
      nextWaypoint.latitude,
      nextWaypoint.longitude
    );

    // Calculate speed with traffic variance
    const variance = 1 + (Math.random() - 0.5) * this.config.trafficVariance;
    const speedMs = (this.config.speedKmh / 3.6) * variance; // km/h to m/s
    const moveDistance = (speedMs * this.config.updateFrequencyMs) / 1000; // meters

    // Move bus
    if (distance > moveDistance) {
      // Move towards next waypoint
      const [newLat, newLng] = this.moveTowards(
        position.lat,
        position.lng,
        nextWaypoint.latitude,
        nextWaypoint.longitude,
        moveDistance
      );
      
      position.lat = newLat;
      position.lng = newLng;
      busState.bearing = this.calculateBearing(
        position.lat,
        position.lng,
        nextWaypoint.latitude,
        nextWaypoint.longitude
      );
    } else {
      // Reached waypoint, move to next
      position.lat = nextWaypoint.latitude;
      position.lng = nextWaypoint.longitude;
      busState.waypointIndex++;

      // Check if this is a stop
      const currentStop = route.stops.find(s => s.stopOrder === stopIndex);
      if (currentStop && this.isNearCoordinate(
        position.lat,
        position.lng,
        currentStop.latitude,
        currentStop.longitude,
        50 // 50 meters threshold
      )) {
        busState.atStop = true;
        busState.stopTimeRemaining = currentStop.dwellTime || this.config.stopDwellTimeMs;
        busState.stopIndex++;
        
        this.io.emit('bus_arrived', {
          busId,
          busNumber: busState.busNumber,
          stopIndex: busState.stopIndex - 1,
          stopName: currentStop.stopName,
          timestamp: new Date(),
        });
      }
    }

    // Update database
    await Bus.updateOne(
      { _id: busId },
      {
        'currentPosition.latitude': position.lat,
        'currentPosition.longitude': position.lng,
        'currentPosition.lastUpdated': new Date(),
        currentRouteIndex: busState.waypointIndex,
        nextStopIndex: busState.stopIndex,
      }
    );

    // Emit real-time update
    this.io.emit('bus_update', {
      busId,
      busNumber: busState.busNumber,
      position: { latitude: position.lat, longitude: position.lng },
      bearing: busState.bearing,
      speed: this.config.speedKmh,
      atStop: busState.atStop,
      timestamp: new Date(),
    });
  }

  /**
   * Calculate distance between two coordinates in meters
   * Using Haversine formula
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth radius in meters
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

  /**
   * Move from one coordinate towards another by specified distance
   */
  moveTowards(lat1, lon1, lat2, lon2, distance) {
    const R = 6371000; // Earth radius in meters
    const d = distance / R;
    const bearing = this.calculateBearing(lat1, lon1, lat2, lon2);

    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const bearingRad = (bearing * Math.PI) / 180;

    const lat2Rad = Math.asin(
      Math.sin(lat1Rad) * Math.cos(d) +
        Math.cos(lat1Rad) * Math.sin(d) * Math.cos(bearingRad)
    );

    const lon2Rad =
      lon1Rad +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(d) * Math.cos(lat1Rad),
        Math.cos(d) - Math.sin(lat1Rad) * Math.sin(lat2Rad)
      );

    return [
      (lat2Rad * 180) / Math.PI,
      (lon2Rad * 180) / Math.PI,
    ];
  }

  /**
   * Calculate bearing between two coordinates
   */
  calculateBearing(lat1, lon1, lat2, lon2) {
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x =
      Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    const bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }

  /**
   * Check if two coordinates are near each other within threshold
   */
  isNearCoordinate(lat1, lon1, lat2, lon2, thresholdMeters) {
    const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
    return distance <= thresholdMeters;
  }

  /**
   * Assign a bus to a route
   */
  async assignBusToRoute(busId, routeId) {
    try {
      const route = await Route.findById(routeId);
      if (!route) throw new Error('Route not found');

      await Bus.updateOne(
        { _id: busId },
        { assignedRoute: routeId, status: 'running' }
      );

      // Reload bus to simulation
      const bus = await Bus.findById(busId).populate('assignedRoute');
      const busState = {
        busId: bus._id.toString(),
        busNumber: bus.busNumber,
        route: bus.assignedRoute,
        position: {
          lat: route.waypoints[0]?.latitude || 0,
          lng: route.waypoints[0]?.longitude || 0,
        },
        waypointIndex: 0,
        stopIndex: 0,
        atStop: false,
        stopTimeRemaining: 0,
        speed: 0,
        bearing: 0,
      };

      this.activeBuses.set(busId, busState);
    } catch (error) {
      console.error('Error assigning bus to route:', error);
    }
  }
}

module.exports = BusSimulationEngine;
