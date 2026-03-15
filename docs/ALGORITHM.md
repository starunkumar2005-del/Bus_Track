# Bus Simulation Algorithm Documentation

## Overview

This document explains the core bus movement simulation algorithm used in the Bus Tracking System. The algorithm simulates realistic bus movement along predefined routes without relying on real GPS data.

## Algorithm Components

### 1. **Distance Calculation - Haversine Formula**

The Haversine formula calculates the great-circle distance between two points on Earth using latitude and longitude.

```
Formula:
a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
c = 2 × atan2(√a, √(1−a))
d = R × c

Where:
- φ is latitude, λ is longitude (in radians)
- R is Earth's radius (≈6,371 km)
- d is the distance between points
```

**Implementation:** Used to calculate distances between consecutive route waypoints and between bus and target waypoint.

### 2. **Movement Vector Calculation**

The algorithm calculates the unit vector (direction) from the bus's current position to the next waypoint.

```
Formula:
direction = normalize(targetPoint - currentPoint)
newPosition = currentPosition + (speed × timeStep × direction)

Where:
- speed is the bus velocity in m/s
- timeStep is the simulation update interval (2 seconds)
```

### 3. **Bearing Calculation**

The bearing (compass direction) from one point to another is calculated using the inverse tangent of the sine and cosine of the angle differences.

```
Formula:
y = sin(Δλ) × cos(φ2)
x = cos(φ1) × sin(φ2) − sin(φ1) × cos(φ2) × cos(Δλ)
bearing = atan2(y, x)

Result: 0-360 degrees (0° = North, 90° = East, etc.)
```

### 4. **Traffic Variance Simulation**

To make the simulation more realistic, speed variations simulate traffic conditions:

```
randomVariance = 1 + (random[-0.5, 0.5] × TRAFFIC_VARIANCE)
actualSpeed = baseSpeed × randomVariance

Where:
- TRAFFIC_VARIANCE = 0.2 (20% variance)
- baseSpeed = 40 km/h (configured)
```

This creates realistic speed fluctuations between 32-48 km/h.

### 5. **Stop Arrival Detection**

When a bus reaches within a threshold distance (50 meters) of a scheduled stop:

1. Bus position is updated to exact stop coordinates
2. `atStop` flag is set to true
3. Dwell time is applied (default: 3 seconds)
4. Stop event is emitted to clients
5. Next waypoint index is incremented

### 6. **Dwell Time Management**

At each stop, the bus remains stationary for a configured duration:

```
if (bus.atStop && stopTimeRemaining > 0) {
  stopTimeRemaining -= updateInterval
  if (stopTimeRemaining <= 0) {
    bus.atStop = false
    emit('bus_departed')
  }
}
```

## Simulation Tick Flow

Each simulation update (every 2 seconds) follows this sequence:

```
FOR each active bus:
  1. Check if bus is at a stop
     - If yes and dwell time remaining: decrement timer, continue
     - If dwell time expired: set atStop = false, emit departure event
  
  2. Get current and next waypoint
  
  3. Calculate distance to next waypoint
  
  4. Calculate actual speed with traffic variance
  
  5. Calculate movement distance = speed × timeInterval
  
  6. If distance to waypoint > movement distance:
     - Move bus incrementally toward waypoint
     - Calculate new bearing
  
  7. Else (reached waypoint):
     - Move bus to waypoint
     - Increment waypoint index
     - Check if waypoint is a stop
     - If stop: apply dwell time, emit arrival event
  
  8. Update database with new position
  
  9. Emit 'bus_update' event to all clients with:
     - New position (lat/lng)
     - Bearing
     - Speed
     - Status

END FOR
```

## Configuration Parameters

| Parameter | Default | Unit | Description |
|-----------|---------|------|-------------|
| `speedKmh` | 40 | km/h | Average bus speed |
| `updateFrequencyMs` | 2000 | ms | Simulation tick interval |
| `stopDwellTimeMs` | 3000 | ms | Default stop duration |
| `trafficVariance` | 0.2 | 0-1 | Speed variation factor |
| `stopThreshold` | 50 | m | Distance to detect stop arrival |

## Example Scenario

**Route:** Station → Market → Hospital → Park → Station

1. **Minute 0:** Bus starts at Station, moving toward Market waypoint
   - Current speed: 38 km/h (with traffic variance)
   - Bearing: 45° (Northeast)

2. **Minute 2:** Bus moves 211 meters closer to Market waypoint
   - Position updated in real-time
   - 'bus_update' event sent to clients

3. **Minute 5:** Bus reaches Market (within 50m)
   - Position snapped to Market stop coordinates
   - 'bus_arrived' event emitted
   - atStop = true, dwell time = 3 seconds

4. **Minute 5-8:** Bus remains at Market stop
   - Position doesn't change
   - dwell timer counts down

5. **Minute 8:** Dwell time expires
   - 'bus_departed' event emitted
   - Bus starts moving toward Hospital waypoint

## Performance Considerations

- **Update Frequency:** 2-second intervals balance realism with server load
- **Distance Calculations:** Haversine formula used only when necessary
- **Memory:** Bus states stored in-memory map (can scale to ~1000 buses per server)
- **WebSocket:** Events broadcast to connected clients only
- **Scalability:** For larger deployments, consider sharding buses across multiple simulation engines

## Limitations & Improvements

### Current Limitations
- Linear interpolation between waypoints (not geodesic curves)
- Uniform speed within variance range (no acceleration/deceleration)
- No multi-path routing algorithm
- Traffic not simulated from real-time data

### Potential Improvements
- Implement Dijkstra/A* for dynamic routing
- Add real traffic API integration
- Implement acceleration/deceleration curves
- Add passenger boarding/alighting simulation
- Integrate GPS deviation patterns
- Real-time delay prediction using ML

## Testing the Algorithm

### Manual Test Case

1. Create route with 5 waypoints
2. Assign bus to route
3. Monitor in real-time via API:
   ```
   GET /api/buses/{busId}/location
   ```
4. Verify:
   - Position changes every 2 seconds
   - Movement follows route waypoints
   - Stops are reached within 50m threshold
   - Speed varies within configured range

### Load Testing

- Simulate 100 buses on same route
- Monitor CPU usage
- Verify WebSocket message queue doesn't overflow
- Check database update throughput

---

**Algorithm Version:** 1.0  
**Last Updated:** January 2026  
**Difficulty Level:** Intermediate
