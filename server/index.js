/**
 * Main Server File
 * Express server with Socket.io for real-time bus tracking
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { createServer } = require('http');
const { Server } = require('socket.io');

const BusSimulationEngine = require('./services/BusSimulationEngine');

// Import routes
const routeRoutes = require('./routes/routeRoutes');
const busRoutes = require('./routes/busRoutes');
const stopRoutes = require('./routes/stopRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));

// Database Connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bus_track';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Bus Simulation Engine
let simulationEngine;

// Initialize Simulation Engine
const initializeSimulation = async () => {
  simulationEngine = new BusSimulationEngine(io);
  await simulationEngine.start();
};

// Socket.io Connection Handling
io.on('connection', (socket) => {
  console.log(`🔗 Client connected: ${socket.id}`);

  // Join room for specific bus tracking
  socket.on('join_room', (data) => {
    const { busId, roomName } = data;
    socket.join(roomName || 'all_buses');
    console.log(`  ✓ ${socket.id} joined room: ${roomName || 'all_buses'}`);
  });

  // Get current bus location
  socket.on('get_bus_location', async (busId) => {
    const Bus = require('./models/Bus');
    try {
      const bus = await Bus.findById(busId);
      if (bus) {
        socket.emit('bus_location', {
          busId,
          position: bus.currentPosition,
          status: bus.status,
        });
      }
    } catch (error) {
      console.error('Error fetching bus location:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔗 Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/stops', stopRoutes);
app.use('/api/schedules', scheduleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Bus Tracking Simulation System API',
    version: '1.0.0',
    endpoints: {
      routes: '/api/routes',
      buses: '/api/buses',
      stops: '/api/stops',
      schedules: '/api/schedules',
      health: '/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await initializeSimulation();

  httpServer.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   Bus Tracking Simulation System       ║
║   Server Running on Port ${PORT}        ║
╚════════════════════════════════════════╝
    `);
    console.log('API Routes:');
    console.log('  - GET  /api/routes');
    console.log('  - POST /api/routes');
    console.log('  - GET  /api/buses');
    console.log('  - POST /api/buses');
    console.log('  - GET  /api/stops');
    console.log('  - POST /api/stops');
    console.log('  - GET  /api/schedules');
    console.log('  - POST /api/schedules');
    console.log('\nWebSocket Events:');
    console.log('  - bus_update (real-time position updates)');
    console.log('  - bus_arrived (bus arrived at stop)');
    console.log('  - bus_departed (bus departed from stop)');
  });
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  if (simulationEngine) {
    simulationEngine.stop();
  }
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = { app, io };
