# Bus Tracking and Simulation System

A web-based public bus tracking and simulation system designed for small cities in Tamil Nadu, India. The system simulates bus movement using algorithms without real GPS data.

## Features

- **Real-time Bus Tracking**: Track simulated buses on interactive maps
- **Route Management**: Create and manage bus routes with multiple stops
- **Bus Simulation**: Realistic bus movement simulation with stops and schedules
- **Live Updates**: WebSocket-based real-time updates
- **Multi-bus Support**: Track multiple buses simultaneously
- **Admin Dashboard**: Manage routes, buses, and schedules
- **Passenger Tracking**: View estimated arrival times at stops

## Architecture

```
Bus Track System
├── Client (React Frontend)
│   ├── Components (Map, BusTracker, RouteList, etc.)
│   ├── Services (API, WebSocket)
│   └── UI (Leaflet Maps, TailwindCSS)
│
├── Server (Node.js/Express Backend)
│   ├── API Routes
│   ├── Bus Simulation Engine
│   ├── Database Models
│   ├── WebSocket Server
│   └── Algorithms (Route planning, Movement simulation)
│
└── Database (MongoDB)
    ├── Routes
    ├── Buses
    ├── Stops
    └── Schedules
```

## Tech Stack

- **Frontend**: React, Leaflet.js, Socket.io-client, TailwindCSS
- **Backend**: Node.js, Express, Socket.io, MongoDB
- **Simulation**: Custom pathfinding and movement algorithms
- **Real-time**: WebSocket (Socket.io)

## Project Structure

```
Bus_track/
├── server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── controllers/        # Business logic
│   ├── services/          # Bus simulation engine
│   ├── config/            # Configuration files
│   ├── utils/             # Helper functions
│   └── index.js           # Server entry point
│
├── client/                 # Frontend application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API & WebSocket services
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # React entry point
│   └── package.json
│
├── docs/                   # Documentation
├── README.md              # This file
└── package.json           # Root package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (or use MongoDB Atlas for cloud)

### Setup

1. **Clone the repository**
```bash
cd Bus_track
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Setup environment variables**
   - Create `.env` file in `server/` directory
   - See `server/.env.example` for template

4. **Start the development servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Bus Simulation Algorithm

The system uses a sophisticated algorithm to simulate realistic bus movement:

1. **Route Definition**: Routes consist of waypoints (latitude/longitude) and stops
2. **Scheduling**: Buses follow predefined schedules with time windows
3. **Movement**: Buses move along routes using:
   - Linear interpolation between waypoints
   - Speed variation (0-60 km/h)
   - Stop dwell time (2-5 minutes)
   - Traffic simulation (randomized delays)

4. **Real-time Updates**: Bus positions updated every 2 seconds to connected clients

## API Endpoints

### Routes
- `GET /api/routes` - List all routes
- `POST /api/routes` - Create new route
- `GET /api/routes/:id` - Get route details
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

### Buses
- `GET /api/buses` - List all buses
- `GET /api/buses/:id` - Get bus details with current position
- `GET /api/buses/:id/location` - Get real-time bus location
- `GET /api/buses/:id/route` - Get bus's assigned route

### Stops
- `GET /api/stops` - List all stops
- `POST /api/stops` - Create new stop
- `GET /api/stops/:id/buses` - Get buses arriving at stop

### Schedules
- `GET /api/schedules` - List all schedules
- `POST /api/schedules` - Create new schedule
- `GET /api/schedules/:busId` - Get bus schedule

## WebSocket Events

### Client to Server
- `join_room` - Join bus tracking room
- `get_bus_location` - Request current bus location

### Server to Client
- `bus_update` - Real-time bus position update
- `bus_arrived` - Bus arrived at stop
- `bus_departed` - Bus departed from stop
- `route_update` - Route information update

## Example Usage

### Start a bus simulation
```bash
# Run admin endpoints to create routes and buses
POST /api/routes
POST /api/buses
POST /api/schedules
```

### Track buses in real-time
- Open http://localhost:3000
- Select a route to view
- See all buses on that route with real-time updates

## Documentation

See [docs/](./docs/) for:
- `ALGORITHM.md` - Detailed simulation algorithm explanation
- `API.md` - Complete API documentation
- `DATABASE.md` - Database schema and models
- `DEPLOYMENT.md` - Deployment guide

## Learning Outcomes

This project demonstrates:
- Full-stack web application development
- Real-time data synchronization with WebSockets
- Geospatial algorithm implementation
- Database design and management
- RESTful API design
- React component architecture
- Server-side simulation engines

## Troubleshooting

### Port already in use
```bash
# Change PORT in server/.env
PORT=5001
```

### MongoDB connection issues
- Ensure MongoDB is running
- Check connection string in server/.env
- Use MongoDB Atlas for cloud database

### Frontend not connecting to backend
- Verify backend is running on correct port
- Check CORS settings in server/index.js
- Verify WebSocket connection URL

## Future Enhancements

- Real GPS integration
- Traffic API integration
- User authentication and roles
- Advanced routing algorithms (A*, Dijkstra)
- Mobile app (React Native)
- Analytics dashboard
- Machine learning for delay prediction

## License

MIT License - Free to use for educational purposes

## Contributors

Student Final-Year Project Team

---

**Note**: This is a student project focused on logic and algorithm clarity rather than production-grade scaling.
