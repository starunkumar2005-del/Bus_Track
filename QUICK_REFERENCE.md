# Quick Reference & Commands

## 🚀 Getting Started

### Step 1: Install Dependencies
```bash
cd Bus_track
npm run install:all
```

### Step 2: Configure Environment
```bash
cd server
cp .env.example .env
# Edit .env as needed
```

### Step 3: Start MongoDB
```bash
# Option A: Local MongoDB
mongod

# Option B: Use MongoDB Atlas (update MONGODB_URI in .env)
```

### Step 4: Seed Sample Data
```bash
cd server
node utils/seedDatabase.js
```

### Step 5: Start Development Servers
```bash
# From root directory
npm run dev
```

### Step 6: Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/health

---

## 📋 Common Commands

### Root Level Commands
```bash
npm run install:all          # Install all dependencies
npm run dev                  # Start both servers (development)
npm run server:dev          # Start backend only (with nodemon)
npm run client:dev          # Start frontend only
npm run server:start        # Start backend (production)
npm run client:build        # Build frontend for production
```

### Server Commands
```bash
cd server

npm install                 # Install server dependencies
npm run dev                # Start with hot reload (nodemon)
npm start                  # Start server
node utils/seedDatabase.js # Generate sample data
```

### Client Commands
```bash
cd client

npm install                 # Install frontend dependencies
npm start                  # Start development server
npm run build              # Build for production
npm test                   # Run tests
```

---

## 🔌 API Quick Reference

### Create a Bus
```bash
curl -X POST http://localhost:5000/api/buses \
  -H "Content-Type: application/json" \
  -d '{
    "busNumber": "TN-01-AB-1001",
    "busType": "AC",
    "capacity": 50,
    "driverName": "John Doe"
  }'
```

### Get All Buses
```bash
curl http://localhost:5000/api/buses
```

### Get Bus Location
```bash
curl http://localhost:5000/api/buses/{busId}/location
```

### Create a Route
```bash
curl -X POST http://localhost:5000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "routeName": "Main Route",
    "routeNumber": "101",
    "waypoints": [
      {"latitude": 11.0168, "longitude": 76.9558, "order": 0},
      {"latitude": 11.0234, "longitude": 76.9612, "order": 1}
    ]
  }'
```

### Assign Bus to Route
```bash
curl -X POST http://localhost:5000/api/buses/{busId}/assign-route \
  -H "Content-Type: application/json" \
  -d '{"routeId": "{routeId}"}'
```

---

## 🛠️ Troubleshooting Commands

### Check if MongoDB is Running
```bash
# Windows
netstat -ano | findstr :27017

# Mac/Linux
lsof -i :27017
```

### Check if Ports are in Use
```bash
# Check port 5000 (backend)
netstat -ano | findstr :5000

# Check port 3000 (frontend)
netstat -ano | findstr :3000
```

### Kill Process on Port
```bash
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

### View Backend Logs
```bash
cd server
npm run dev
# Logs will show in terminal
```

### Reset Database
```bash
# In MongoDB shell:
use bus_track
db.dropDatabase()

# Then seed new data:
node utils/seedDatabase.js
```

### Clear Node Modules
```bash
# Remove and reinstall
rm -rf node_modules
npm run install:all
```

---

## 📊 File Locations

| File | Location | Purpose |
|------|----------|---------|
| Server Entry | `server/index.js` | Main backend server |
| Simulation Engine | `server/services/BusSimulationEngine.js` | Bus movement logic |
| Models | `server/models/` | Database schemas |
| API Routes | `server/routes/` | REST endpoints |
| Controllers | `server/controllers/` | Business logic |
| React App | `client/src/App.js` | Main frontend component |
| Map Component | `client/src/components/BusMap.js` | Map display |
| Admin Dashboard | `client/src/components/AdminDashboard.js` | Management UI |
| API Client | `client/src/services/api.js` | REST client |
| Socket Client | `client/src/services/socket.js` | WebSocket client |
| CSS Files | `client/src/styles/` | Styling |
| Documentation | `docs/` | All guides |
| Configuration | `server/.env` | Environment variables |

---

## 🔑 Key Files to Understand

### 1. **BusSimulationEngine.js** (Core Algorithm)
- Haversine distance calculation
- Bus movement simulation
- Stop detection and dwell time
- Traffic variance simulation

### 2. **Bus Model** (server/models/Bus.js)
- Bus entity structure
- Position tracking
- Status management
- Route assignment

### 3. **BusMap Component** (client/src/components/BusMap.js)
- Leaflet map integration
- Real-time position updates
- Route visualization
- Bus markers

### 4. **Socket Service** (client/src/services/socket.js)
- WebSocket connection
- Event listeners
- Real-time communication

---

## 💡 Common Customizations

### Change Simulation Speed
Edit `server/.env`:
```
BUS_SPEED_KMH=50  # Default: 40 km/h
```

### Change Update Frequency
Edit `server/.env`:
```
SIMULATION_UPDATE_INTERVAL=1000  # Update every 1 second (default: 2000ms)
```

### Change Stop Dwell Time
Edit `server/.env`:
```
STOP_DWELL_TIME_MS=5000  # Stay 5 seconds at stops (default: 3000ms)
```

### Change Traffic Variance
Edit `server/.env`:
```
TRAFFIC_DELAY_VARIANCE=0.3  # 30% variance (default: 0.2)
```

### Add More Waypoints to Route
Edit the route creation (API or database):
```json
"waypoints": [
  {"latitude": 11.0168, "longitude": 76.9558, "order": 0},
  {"latitude": 11.0200, "longitude": 76.9580, "order": 1},
  {"latitude": 11.0234, "longitude": 76.9612, "order": 2}
]
```

---

## 📚 Documentation Map

- **PROJECT_SUMMARY.md** ← START HERE!
- **docs/GETTING_STARTED.md** - Installation & setup
- **docs/ALGORITHM.md** - Technical algorithm details
- **docs/API.md** - API reference & examples
- **docs/DATABASE.md** - Database schema details
- **README.md** - Project overview

---

## 🎯 Development Workflow

### Daily Development
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start

# Terminal 3 - MongoDB
mongod
```

### Making Changes
- Edit files in `server/` or `client/`
- Changes auto-reload due to nodemon/react-scripts
- Check console for errors

### Testing API
- Use curl commands above
- Or use Postman: https://www.postman.com/
- Or use VS Code Thunder Client

### Checking Simulation
- Open http://localhost:3000
- Watch buses move on map
- Open browser console for WebSocket logs

---

## 🐛 Debugging Tips

### Backend Debugging
```bash
# In server/index.js, add console logs:
console.log('Bus position:', busState.position);
console.log('Simulation tick:', new Date());
```

### Frontend Debugging
```bash
# Open browser Developer Tools (F12)
# Check Network tab for API calls
# Check Console for errors
# Check Application tab for Socket connection
```

### Database Debugging
```bash
# In MongoDB shell:
use bus_track
db.buses.find()
db.buses.findOne({busNumber: "TN-01-AB-1001"})
db.buses.find().count()
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] Dependencies installed (`npm run install:all`)
- [ ] `.env` file created and configured
- [ ] Sample data seeded (`node utils/seedDatabase.js`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Buses visible on map
- [ ] Buses moving in real-time
- [ ] Admin dashboard loads

---

## 🆘 Need Help?

1. **Check Documentation**
   - docs/GETTING_STARTED.md
   - docs/ALGORITHM.md
   - docs/API.md

2. **Check Logs**
   - Backend console (npm run dev output)
   - Browser console (F12)
   - MongoDB logs (mongod output)

3. **Verify Setup**
   - MongoDB running
   - Ports available (5000, 3000)
   - Dependencies installed
   - `.env` configured

4. **Check Database**
   - Sample data created
   - Routes and buses exist
   - Buses assigned to routes

5. **Review Code**
   - BusSimulationEngine.js
   - BusMap.js
   - API endpoints
   - Socket events

---

**Quick Start Time: ~5-10 minutes**  
**Expected System to Run: 2-3 minutes**  
**First Buses Moving: 1-2 minutes after page load**

Good luck! 🚀
