# Database Schema Documentation

## Overview

The Bus Tracking System uses MongoDB for data persistence. This document describes all collections, their schemas, and relationships.

---

## Collections

### 1. Routes Collection

Stores bus route information with waypoints and stops.

```javascript
{
  _id: ObjectId,
  routeId: String (UUID),          // Unique route identifier
  routeNumber: String,             // Display number (e.g., "101")
  routeName: String,               // Display name
  description: String,             // Optional description
  
  waypoints: [                     // Path coordinates
    {
      latitude: Number,            // Decimal degrees
      longitude: Number,           // Decimal degrees
      order: Number                // Sequence order
    }
  ],
  
  stops: [                         // Bus stops along route
    {
      stopId: String,              // Unique stop identifier
      stopName: String,            // Stop name
      latitude: Number,
      longitude: Number,
      stopOrder: Number,           // Sequence
      dwellTime: Number            // ms to stay at stop (default: 180000)
    }
  ],
  
  totalDistance: Number,           // km
  estimatedDuration: Number,       // minutes
  isActive: Boolean,               // Route operational status
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `routeId` (unique)
- `routeNumber` (unique)
- `isActive`

---

### 2. Buses Collection

Represents physical buses in the fleet.

```javascript
{
  _id: ObjectId,
  busId: String (UUID),            // Unique bus identifier
  busNumber: String,               // Registration number
  busType: String,                 // "AC", "NON-AC", "SEMI-AC"
  capacity: Number,                // Seating capacity
  
  assignedRoute: ObjectId,         // Reference to Routes collection
  
  currentPosition: {
    latitude: Number,
    longitude: Number,
    lastUpdated: Date              // Timestamp of last update
  },
  
  status: String,                  // "idle", "running", "stopped", "maintenance"
  
  currentRouteIndex: Number,       // Index in route waypoints
  nextStopIndex: Number,           // Index of next stop
  lastStopIndex: Number,           // Index of last stop visited
  currentPassengers: Number,       // Passengers on board
  
  registrationNumber: String,      // License plate
  driverName: String,
  phone: String,
  
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `busId` (unique)
- `busNumber` (unique)
- `status`
- `assignedRoute`

**References:**
- `assignedRoute` → Routes._id

---

### 3. Stops Collection

Individual bus stops/stations.

```javascript
{
  _id: ObjectId,
  stopId: String (UUID),           // Unique identifier
  stopName: String,                // Display name
  latitude: Number,
  longitude: Number,
  city: String,                    // City name
  description: String,             // Optional description
  
  hasShelter: Boolean,             // Amenity flags
  hasBench: Boolean,
  hasWater: Boolean,
  hasToilet: Boolean,
  
  routes: [ObjectId],              // Array of route references
  
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `stopId` (unique)
- `city`
- `isActive`

**References:**
- `routes` → Routes._id (array)

---

### 4. Schedules Collection

Bus schedules and trip information.

```javascript
{
  _id: ObjectId,
  scheduleId: String (UUID),
  
  bus: ObjectId,                   // Reference to Buses collection
  route: ObjectId,                 // Reference to Routes collection
  
  daysOfWeek: [String],            // ["MON", "TUE", "WED", ...]
  
  trips: [                         // Daily trips
    {
      tripId: String (UUID),
      startTime: String,           // HH:MM format (24-hour)
      endTime: String,             // HH:MM format
      startStopIndex: Number,      // Index in route.stops
      endStopIndex: Number,
      status: String               // "pending", "completed", "cancelled"
    }
  ],
  
  frequency: Number,               // Minutes between trips
  
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `scheduleId` (unique)
- `bus`
- `route`
- `isActive`

**References:**
- `bus` → Buses._id
- `route` → Routes._id

---

## Relationships

```
Routes (1) ──── (M) Buses
  ↓
  └── (M) Stops

Buses (1) ──── (M) Schedules
           ──── (M) Routes

Schedules (M) ──── (1) Routes
```

---

## Data Flow Examples

### Example 1: Creating a Bus Route System

```javascript
// 1. Create Route
route = {
  routeNumber: "101",
  waypoints: [...],
  stops: [...]
}
routeId = db.routes.insertOne(route)

// 2. Create Bus
bus = {
  busNumber: "TN-01-AB-1001",
  assignedRoute: routeId
}
busId = db.buses.insertOne(bus)

// 3. Create Schedule
schedule = {
  bus: busId,
  route: routeId,
  trips: [...]
}
db.schedules.insertOne(schedule)
```

### Example 2: Real-time Bus Position Update

```javascript
// Simulation engine updates bus position every 2 seconds
db.buses.updateOne(
  { _id: busId },
  {
    $set: {
      "currentPosition.latitude": newLat,
      "currentPosition.longitude": newLng,
      "currentPosition.lastUpdated": new Date(),
      currentRouteIndex: newIndex
    }
  }
)
```

---

## Query Examples

### Get all buses on a route

```javascript
db.buses.find({ assignedRoute: routeId })
```

### Get active routes

```javascript
db.routes.find({ isActive: true })
```

### Get stops in a city

```javascript
db.stops.find({ city: "Coimbatore" })
```

### Get bus schedule

```javascript
db.schedules.findOne({ bus: busId })
```

### Get buses near a location

```javascript
db.buses.find({
  "currentPosition.latitude": { $gte: 10.9, $lte: 11.1 },
  "currentPosition.longitude": { $gte: 76.8, $lte: 77.0 }
})
```

### Get running buses with passengers

```javascript
db.buses.find({
  status: "running",
  currentPassengers: { $gt: 0 }
})
```

---

## Indexes for Performance

### Recommended Indexes

```javascript
// Routes
db.routes.createIndex({ routeId: 1 }, { unique: true })
db.routes.createIndex({ routeNumber: 1 }, { unique: true })
db.routes.createIndex({ isActive: 1 })

// Buses
db.buses.createIndex({ busId: 1 }, { unique: true })
db.buses.createIndex({ busNumber: 1 }, { unique: true })
db.buses.createIndex({ status: 1 })
db.buses.createIndex({ assignedRoute: 1 })
db.buses.createIndex({
  "currentPosition.latitude": 1,
  "currentPosition.longitude": 1
})

// Stops
db.stops.createIndex({ stopId: 1 }, { unique: true })
db.stops.createIndex({ city: 1 })
db.stops.createIndex({ isActive: 1 })

// Schedules
db.schedules.createIndex({ scheduleId: 1 }, { unique: true })
db.schedules.createIndex({ bus: 1 })
db.schedules.createIndex({ route: 1 })
db.schedules.createIndex({ isActive: 1 })
```

---

## Data Validation

### Route Validation

- `routeNumber`: Required, unique, non-empty string
- `routeName`: Required, non-empty string
- `waypoints`: Array with minimum 2 elements
- `stops`: Can be empty or array of stop objects
- Each waypoint/stop must have latitude (-90 to 90) and longitude (-180 to 180)

### Bus Validation

- `busNumber`: Required, unique, non-empty string
- `busType`: Must be "AC", "NON-AC", or "SEMI-AC"
- `capacity`: Required, positive integer
- `status`: Must be one of enum values
- Position coordinates must be valid geographic values

### Stop Validation

- `stopName`: Required, non-empty string
- `latitude` & `longitude`: Required, valid geographic coordinates
- All amenity fields: Boolean values only

---

## Backup Strategy

### Regular Backups

```bash
# Backup database
mongodump --db bus_track --out ./backups/bus_track_backup

# Restore database
mongorestore --db bus_track ./backups/bus_track_backup/bus_track
```

### MongoDB Atlas Backup

- Automatic daily backups (included in Atlas)
- Point-in-time recovery (last 35 days)
- Manual snapshots available

---

## Scalability Considerations

### Current Capacity

- **Buses:** ~1,000 per server
- **Routes:** Unlimited
- **Stops:** Unlimited
- **Update Frequency:** Every 2 seconds

### Future Optimizations

1. **Sharding:** Distribute buses across multiple servers
2. **Caching:** Redis for frequently accessed routes/stops
3. **Archiving:** Move old schedule data to separate collection
4. **Partitioning:** Time-based partitioning for position updates

---

## Monitoring Queries

### Collection Statistics

```javascript
db.buses.stats()
db.routes.stats()
db.stops.stats()
db.schedules.stats()
```

### Database Size

```javascript
db.stats()
```

### Index Information

```javascript
db.buses.getIndexes()
```

---

**Schema Version:** 1.0  
**Last Updated:** January 2026  
**MongoDB Version:** 4.0+
