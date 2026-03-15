# Getting Started Guide

## Quick Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Installation Steps

#### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (root, server, and client)
npm run install:all
```

#### 2. Configure Environment

Create `.env` file in the `server/` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bus_track
CORS_ORIGIN=http://localhost:3000
SIMULATION_UPDATE_INTERVAL=2000
BUS_SPEED_KMH=40
STOP_DWELL_TIME_MS=3000
```

#### 3. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create a free account
- Create a cluster
- Get connection string
- Replace `MONGODB_URI` in `.env`

#### 4. Start the Application

**Development Mode (Both servers with hot reload)**
```bash
npm run dev
```

**Or start separately:**

```bash
# Terminal 1 - Start backend
cd server
npm run dev
# Should show: ✓ MongoDB connected
# And: Bus Tracking Simulation System - Server Running on Port 5000

# Terminal 2 - Start frontend
cd client
npm start
# Should open http://localhost:3000 automatically
```

### Verify Installation

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```
   Expected: `{"status": "ok", "mongodb": "connected"}`

2. **Frontend:** Open http://localhost:3000
   - You should see "Live Tracker" and "Admin Dashboard" tabs

3. **WebSocket Connection:** Check browser console
   - You should see: "Socket connected"

---

## First Time Setup - Create Sample Data

### 1. Create a Route

```bash
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "routeName": "Coimbatore City Tour",
    "routeNumber": "101",
    "waypoints": [
      {"latitude": 11.0168, "longitude": 76.9558, "order": 0},
      {"latitude": 11.0234, "longitude": 76.9612, "order": 1},
      {"latitude": 11.0195, "longitude": 76.9679, "order": 2},
      {"latitude": 11.0100, "longitude": 76.9620, "order": 3}
    ],
    "stops": [
      {
        "stopId": "stop-1",
        "stopName": "Main Bus Station",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "stopOrder": 0,
        "dwellTime": 3000
      },
      {
        "stopId": "stop-2",
        "stopName": "Market Area",
        "latitude": 11.0234,
        "longitude": 76.9612,
        "stopOrder": 1,
        "dwellTime": 3000
      },
      {
        "stopId": "stop-3",
        "stopName": "Hospital",
        "latitude": 11.0195,
        "longitude": 76.9679,
        "stopOrder": 2,
        "dwellTime": 3000
      },
      {
        "stopId": "stop-4",
        "stopName": "University",
        "latitude": 11.0100,
        "longitude": 76.9620,
        "stopOrder": 3,
        "dwellTime": 3000
      }
    ]
  }'
```

Copy the returned `_id` value (this is your route ID).

### 2. Create Buses

```bash
curl -X POST http://localhost:5000/api/buses \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "TN-01-AB-1001",
    "busType": "AC",
    "capacity": 50,
    "driverName": "Rajesh Kumar",
    "phone": "+91-98765-43210"
  }'

curl -X POST http://localhost:5000/api/buses \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "TN-01-AB-1002",
    "busType": "NON-AC",
    "capacity": 60,
    "driverName": "Priya Singh",
    "phone": "+91-98765-43211"
  }'
```

Copy both `_id` values.

### 3. Assign Buses to Route

```bash
# Replace ROUTE_ID and BUS_ID with values from above
curl -X POST http://localhost:5000/api/buses/BUS_ID/assign-route \
  -H "Content-Type: application/json" \
  -d '{"routeId": "ROUTE_ID"}'
```

### 4. View in Real-time

1. Go to http://localhost:3000
2. Click "Live Tracker" tab
3. Select the route from dropdown
4. Watch buses move on the map in real-time!

---

## Common Issues & Solutions

### Port Already in Use

```bash
# Change port in server/.env
PORT=5001

# Or kill existing process
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Make sure MongoDB is running: `mongod`
2. Use MongoDB Atlas instead (connection string in `.env`)
3. Check `MONGODB_URI` is correct

### Socket Connection Failed

**Frontend Console shows:**
```
GET http://localhost:5000/socket.io/?... 404
```

**Solutions:**
1. Make sure backend is running: `npm run server:dev`
2. Check backend server is on port 5000
3. Check `REACT_APP_SOCKET_URL` is correct in client code

### Buses Not Moving

**Check:**
1. Backend console shows simulation running
2. Route has waypoints
3. Buses are assigned to route
4. Bus status is "running"

### Reset Everything

```bash
# Clear MongoDB
# In MongoDB shell:
use bus_track
db.dropDatabase()

# Restart backend
cd server
npm run dev
```

---

## Project Structure

```
Bus_track/
├── server/
│   ├── models/              # Database schemas
│   ├── controllers/         # Business logic
│   ├── routes/              # API endpoints
│   ├── services/            # Simulation engine
│   ├── index.js             # Server entry point
│   └── .env                 # Configuration
│
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API & Socket clients
│   │   ├── styles/          # CSS files
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json
│
├── docs/
│   ├── ALGORITHM.md         # Simulation algorithm
│   ├── API.md               # API documentation
│   ├── GETTING_STARTED.md   # This file
│   └── DATABASE.md          # Database schema
│
└── README.md
```

---

## Next Steps

1. **Explore the Admin Dashboard**
   - Create more routes and buses
   - Test the management interface

2. **Customize Configuration**
   - Adjust bus speed in `.env`
   - Modify stop dwell times
   - Change update frequency

3. **Add Real Routes**
   - Use Google Maps to get coordinates
   - Create routes for your city

4. **Extend Features**
   - Add user authentication
   - Implement schedule management
   - Add passenger booking

5. **Study the Code**
   - Review simulation algorithm (BusSimulationEngine.js)
   - Understand Socket.io implementation
   - Learn React component patterns

---

## Useful Commands

```bash
# Development
npm run dev                      # Start both servers

# Server only
cd server
npm run dev                      # Start with nodemon
npm start                        # Production mode

# Client only
cd client
npm start                        # Start React dev server
npm run build                    # Build for production
npm test                         # Run tests

# Root level
npm run install:all              # Install all dependencies
npm run server:dev              # Start server in dev mode
npm run client:dev              # Start client in dev mode
```

---

## Learning Resources

- **Haversine Formula:** https://en.wikipedia.org/wiki/Haversine_formula
- **Express.js:** https://expressjs.com/
- **React Documentation:** https://react.dev/
- **Socket.io Guide:** https://socket.io/docs/
- **MongoDB Manual:** https://docs.mongodb.com/manual/
- **Leaflet Maps:** https://leafletjs.com/

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Difficulty:** Beginner-friendly
