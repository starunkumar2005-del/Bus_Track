# System Architecture & Design

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Frontend (Port 3000)                 │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐        ┌──────────────────────────┐    │   │
│  │  │  BusMap.js  │        │  AdminDashboard.js      │    │   │
│  │  │  • Leaflet  │        │  • Route Management     │    │   │
│  │  │  • Markers  │        │  • Bus Management       │    │   │
│  │  │  • Routes   │        │  • Stop Management      │    │   │
│  │  └─────────────┘        └──────────────────────────┘    │   │
│  │         ↓                           ↓                    │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │           Service Layer                         │    │   │
│  │  ├──────────────────────────────────────────────────┤    │   │
│  │  │  api.js (Axios)  │  socket.js (Socket.io)      │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                    ↓ HTTP & WebSocket ↓
┌─────────────────────────────────────────────────────────────────┐
│              Express Server (Port 5000)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Middleware Layer                           │   │
│  │  • CORS Configuration                                   │   │
│  │  • JSON Parsing                                         │   │
│  │  • Error Handling                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Socket.io Server                             │   │
│  │  Events:                                                │   │
│  │  • bus_update (emit)                                    │   │
│  │  • bus_arrived (emit)                                   │   │
│  │  • bus_departed (emit)                                  │   │
│  │  • join_room (listen)                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              REST API Routes                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │  /api/routes    /api/buses    /api/stops               │   │
│  │  /api/schedules                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│           ↓              ↓              ↓                       │
│  ┌────────────────┐ ┌───────────────┐ ┌──────────────┐         │
│  │Route Controller│ │Bus Controller │ │Stop          │         │
│  └────────────────┘ └───────────────┘ │Controller    │         │
│           ↓              ↓              └──────────────┘         │
│           └──────────────┼──────────────────────────────────┐    │
│                          ↓                                  │    │
│  ┌──────────────────────────────────────────────────────┐  │    │
│  │       BusSimulationEngine (Core Logic)              │  │    │
│  ├──────────────────────────────────────────────────────┤  │    │
│  │  • Haversine Distance Calculation                  │  │    │
│  │  • Movement Interpolation                          │  │    │
│  │  • Stop Arrival Detection                          │  │    │
│  │  • Dwell Time Management                           │  │    │
│  │  • Traffic Variance Simulation                     │  │    │
│  │  • Real-time Position Updates                      │  │    │
│  └──────────────────────────────────────────────────────┘  │    │
│                          ↓                                  │    │
│  ┌──────────────────────────────────────────────────────┐  │    │
│  │           Database Models (Mongoose)               │  │    │
│  ├──────────────────────────────────────────────────────┤  │    │
│  │  • Route Schema    • Bus Schema                    │  │    │
│  │  • Stop Schema     • Schedule Schema               │  │    │
│  └──────────────────────────────────────────────────────┘  │    │
│                          ↓                                  │    │
│  └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│              MongoDB Database                                  │
├─────────────────────────────────────────────────────────────────┤
│  Collections:                                                   │
│  • routes       (Route definitions with waypoints & stops)     │
│  • buses        (Fleet information & current positions)        │
│  • stops        (Bus stop data)                                │
│  • schedules    (Trip schedules)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 Data Flow Diagram

### Real-time Bus Update Flow

```
Simulation Engine (Server)
        ↓ (Every 2 seconds)
    Tick Event
        ↓
    For Each Bus:
        ├─ Calculate distance to next waypoint
        ├─ Apply traffic variance
        ├─ Move bus incrementally
        ├─ Check if reached stop
        └─ Emit 'bus_update' event
        ↓
    Socket.io Broadcast
        ↓
    Connected Clients Receive
        ↓
    React State Update
        ↓
    Leaflet Marker Updated
        ↓
    User Sees Buses Moving ✓
```

### Bus Creation Flow

```
User (Admin Dashboard)
        ↓
    Submit Bus Form
        ↓
    api.busService.createBus()
        ↓
    POST /api/buses
        ↓
    busController.createBus()
        ↓
    Bus.create() (MongoDB)
        ↓
    Response to Client
        ↓
    Update UI ✓
        ↓
    Bus Available for Assignment
```

### Route Assignment Flow

```
User (Admin Dashboard)
        ↓
    Select Bus & Route
        ↓
    api.busService.assignBusToRoute()
        ↓
    POST /api/buses/:id/assign-route
        ↓
    busController.assignBusToRoute()
        ↓
    Bus.updateOne() (MongoDB)
        ↓
    simulationEngine.assignBusToRoute()
        ↓
    Add Bus to activeBuses Map
        ↓
    Start Movement Simulation ✓
```

---

## 🔄 Simulation Lifecycle

```
SERVER START
    ↓
Initialize Express Server
    ↓
Connect to MongoDB
    ↓
Create BusSimulationEngine
    ↓
Load Active Buses from DB
    ↓
Start Simulation Loop
    ├─ Interval: 2 seconds
    ├─ For each active bus:
    │   ├─ Get current state
    │   ├─ Calculate next position
    │   ├─ Update database
    │   └─ Emit WebSocket event
    └─ Repeat
    ↓
WebSocket Events Broadcast
    ↓
Clients Receive Updates
    ↓
UI Updates (Map Markers)
    ↓
User Sees Real-time Movement ✓
```

---

## 🎯 Component Responsibilities

### Frontend Components

**BusMap.js**
- Render Leaflet map
- Display route polylines
- Show bus markers
- Handle real-time updates
- Display bus information panel

**AdminDashboard.js**
- Display management tables
- Create new buses
- Manage routes and stops
- Delete resources
- Handle form submissions

### Backend Components

**BusSimulationEngine.js**
- Simulate bus movement
- Calculate distances (Haversine)
- Detect stop arrivals
- Manage dwell times
- Broadcast updates

**Controllers**
- Handle HTTP requests
- Business logic
- Validation
- Response formatting

**Models**
- Database schemas
- Data validation
- Relationships
- Indexing

---

## 💾 Data Persistence

### On Startup
```
Server Starts
    ↓
Load all isActive=true buses
    ↓
Load assigned routes
    ↓
Initialize activeBuses map
    ↓
Ready to simulate
```

### During Runtime
```
Every 2 seconds:
    ↓
Calculate new position
    ↓
Update Bus.currentPosition in DB
    ↓
Emit WebSocket event
    ↓
Continue simulation
```

### On Shutdown
```
Graceful shutdown signal
    ↓
Stop simulation loop
    ↓
Close WebSocket connections
    ↓
Disconnect MongoDB
    ↓
Exit process
```

---

## 🔌 API Layer Structure

```
API Request
    ↓
Express Middleware
    ├─ CORS Check
    ├─ JSON Parse
    └─ Error Handler
    ↓
Route Matching
    ├─ GET /api/buses → busRoutes
    ├─ GET /api/routes → routeRoutes
    ├─ GET /api/stops → stopRoutes
    └─ GET /api/schedules → scheduleRoutes
    ↓
Controller Method
    ├─ routeController.getAllBuses()
    ├─ busController.createBus()
    └─ etc.
    ↓
Model Query
    ├─ Bus.find()
    ├─ Bus.create()
    ├─ Bus.updateOne()
    └─ Bus.deleteOne()
    ↓
Database Response
    ↓
Format Response
    ↓
Send to Client (JSON)
```

---

## 📊 State Management

### Server State
```
activeBuses: Map<busId, busState>
├─ busId: ObjectId
├─ busNumber: String
├─ route: RouteObject
├─ position: {lat, lng}
├─ waypointIndex: Number
├─ stopIndex: Number
├─ atStop: Boolean
└─ stopTimeRemaining: Number
```

### Client State
```
React Component State
├─ buses: Array<Bus>
├─ routes: Array<Route>
├─ stops: Array<Stop>
├─ selectedBus: Bus | null
├─ selectedRoute: Route | null
└─ loading: Boolean
```

---

## 🔐 Security Considerations

### Current Implementation
- No authentication
- CORS allows localhost
- No rate limiting
- No input validation

### Recommended for Production
```
Add Middleware:
    ├─ JWT Authentication
    ├─ Request Validation
    ├─ Rate Limiting
    ├─ Logging
    ├─ Error Handling
    └─ HTTPS/SSL
```

---

## 📈 Scalability Considerations

### Current Capacity
- ~1000 buses per server
- ~100 routes
- Unlimited stops
- 2-second update interval

### Future Improvements
```
Scaling Strategies:
├─ Horizontal Scaling (Multiple Servers)
├─ Load Balancing
├─ Database Sharding
├─ WebSocket Clustering
├─ Caching Layer (Redis)
└─ Message Queue (RabbitMQ)
```

---

## 🎯 Deployment Architecture

### Development
```
localhost:3000 (React Dev Server)
localhost:5000 (Express Server)
localhost:27017 (MongoDB)
```

### Production
```
CDN/Static Host: React Build
API Server: Express (Cloud VM)
Database: MongoDB Atlas
WebSocket: Connection Pooling
Load Balancer: Nginx/HAProxy
```

---

## 🧪 Testing Architecture

### Unit Tests
- Controller functions
- Algorithm calculations
- Helper functions

### Integration Tests
- API endpoints
- Database operations
- Socket events

### System Tests
- Full bus tracking flow
- Real-time updates
- Simulation accuracy

---

## 📝 Logging & Monitoring

```
Application Logs:
├─ Server startup
├─ Database connection
├─ Simulation ticks
├─ API requests
├─ WebSocket connections
└─ Errors & warnings

Metrics to Track:
├─ Active buses
├─ Bus positions
├─ Stop arrivals
├─ API response times
├─ WebSocket message count
└─ Database query times
```

---

**Architecture Version:** 1.0  
**Last Updated:** January 2026  
**Design Pattern:** MVC with Real-time Event Layer
