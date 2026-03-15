/**
 * Sample Data Generator
 * Creates sample routes, buses, and stops for testing
 * 
 * Usage: node utils/seedDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Stop = require('../models/Stop');
const Schedule = require('../models/Schedule');

// Coimbatore, Tamil Nadu coordinates
const COIMBATORE_LAT = 11.0168;
const COIMBATORE_LNG = 76.9558;

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bus_track';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✓ Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await Route.deleteMany({});
    await Bus.deleteMany({});
    await Stop.deleteMany({});
    await Schedule.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Create Stops
    console.log('Creating stops...');
    const stopsData = [
      {
        stopName: 'Main Bus Station',
        latitude: 11.0168,
        longitude: 76.9558,
        city: 'Coimbatore',
      },
      {
        stopName: 'Market Area',
        latitude: 11.0234,
        longitude: 76.9612,
        city: 'Coimbatore',
      },
      {
        stopName: 'Government Hospital',
        latitude: 11.0195,
        longitude: 76.9679,
        city: 'Coimbatore',
      },
      {
        stopName: 'University Gate',
        latitude: 11.0100,
        longitude: 76.9620,
        city: 'Coimbatore',
      },
      {
        stopName: 'Tech Park',
        latitude: 11.0220,
        longitude: 76.9550,
        city: 'Coimbatore',
      },
    ];

    const stops = await Stop.insertMany(
      stopsData.map(stop => ({
        stopId: uuidv4(),
        ...stop,
        hasShelter: true,
        hasBench: true,
      }))
    );

    console.log(`✓ Created ${stops.length} stops\n`);

    // Create Routes
    console.log('Creating routes...');
    const routeData = {
      routeId: uuidv4(),
      routeNumber: '101',
      routeName: 'City Center - University Route',
      description: 'Main route covering city center and university',
      waypoints: [
        { latitude: 11.0168, longitude: 76.9558, order: 0 },
        { latitude: 11.0200, longitude: 76.9580, order: 1 },
        { latitude: 11.0234, longitude: 76.9612, order: 2 },
        { latitude: 11.0215, longitude: 76.9650, order: 3 },
        { latitude: 11.0195, longitude: 76.9679, order: 4 },
        { latitude: 11.0150, longitude: 76.9640, order: 5 },
        { latitude: 11.0100, longitude: 76.9620, order: 6 },
      ],
      stops: stops.map((stop, index) => ({
        stopId: stop.stopId,
        stopName: stop.stopName,
        latitude: stop.latitude,
        longitude: stop.longitude,
        stopOrder: index,
        dwellTime: 3000,
      })),
      totalDistance: 8.5,
      estimatedDuration: 25,
      isActive: true,
    };

    const route = await Route.create(routeData);
    console.log(`✓ Created route: ${route.routeNumber} - ${route.routeName}\n`);

    // Create Buses
    console.log('Creating buses...');
    const busesData = [
      {
        busNumber: 'TN-01-AB-1001',
        busType: 'AC',
        capacity: 50,
        driverName: 'Rajesh Kumar',
        phone: '+91-98765-43210',
      },
      {
        busNumber: 'TN-01-AB-1002',
        busType: 'NON-AC',
        capacity: 60,
        driverName: 'Priya Singh',
        phone: '+91-98765-43211',
      },
      {
        busNumber: 'TN-01-AB-1003',
        busType: 'SEMI-AC',
        capacity: 55,
        driverName: 'Amit Patel',
        phone: '+91-98765-43212',
      },
    ];

    const buses = await Bus.insertMany(
      busesData.map(bus => ({
        busId: uuidv4(),
        ...bus,
        assignedRoute: route._id,
        status: 'running',
        currentPosition: {
          latitude: 11.0168,
          longitude: 76.9558,
        },
        currentPassengers: Math.floor(Math.random() * bus.capacity),
      }))
    );

    console.log(`✓ Created ${buses.length} buses\n`);

    // Create Schedules
    console.log('Creating schedules...');
    const schedules = await Schedule.insertMany(
      buses.map(bus => ({
        scheduleId: uuidv4(),
        bus: bus._id,
        route: route._id,
        daysOfWeek: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        trips: [
          {
            tripId: uuidv4(),
            startTime: '06:00',
            endTime: '22:00',
            startStopIndex: 0,
            endStopIndex: stops.length - 1,
            status: 'pending',
          },
        ],
        frequency: 30,
        isActive: true,
      }))
    );

    console.log(`✓ Created ${schedules.length} schedules\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('✓ Database seeding completed!');
    console.log('═══════════════════════════════════════');
    console.log(`
Created:
  • ${stops.length} Bus Stops
  • 1 Route (${route.routeNumber})
  • ${buses.length} Buses
  • ${schedules.length} Schedules

Next Steps:
  1. Start the backend: npm run dev (in server folder)
  2. Open http://localhost:3000 in your browser
  3. Go to "Live Tracker" tab
  4. Watch buses move in real-time!

Routes:
  GET    http://localhost:5000/api/routes
  GET    http://localhost:5000/api/buses
  GET    http://localhost:5000/api/stops

Sample Bus IDs (for testing):
${buses.map((b, i) => `  ${i + 1}. ${b.busNumber}: ${b._id}`).join('\n')}
    `);

    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
