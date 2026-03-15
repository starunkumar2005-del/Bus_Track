/**
 * Enhanced Database Seeder - Tamil Nadu Bus System
 * Creates sample routes and stops for all major Tamil Nadu cities
 * 
 * Usage: node utils/seedTamilnadu.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Stop = require('../models/Stop');
const tamilnaduStops = require('./tamilnaduStops');

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
    console.log('✓ Cleared existing data\n');

    let totalStops = 0;
    let totalRoutes = 0;

    // Process each city
    for (const [city, stopsData] of Object.entries(tamilnaduStops)) {
      console.log(`\n📍 Processing ${city.toUpperCase()}...`);
      
      // Create stops for this city
      const cityStops = await Stop.insertMany(
        stopsData.map(stop => ({
          stopId: uuidv4(),
          ...stop,
          hasShelter: true,
          hasBench: true,
          createdAt: new Date(),
        }))
      );
      
      console.log(`   ✓ Created ${cityStops.length} stops`);
      totalStops += cityStops.length;

      // Create routes using stops from this city
      if (cityStops.length >= 2) {
        // Create main route connecting first 5 stops
        const routeStops = cityStops.slice(0, Math.min(5, cityStops.length));
        const waypoints = routeStops.map((stop, index) => ({
          latitude: stop.latitude,
          longitude: stop.longitude,
          order: index,
        }));

        // Calculate approximate distance (simple estimation)
        let totalDistance = 0;
        for (let i = 0; i < waypoints.length - 1; i++) {
          const lat1 = waypoints[i].latitude;
          const lng1 = waypoints[i].longitude;
          const lat2 = waypoints[i + 1].latitude;
          const lng2 = waypoints[i + 1].longitude;
          
          // Haversine approximation
          const R = 6371; // km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.asin(Math.sqrt(a));
          totalDistance += R * c;
        }

        const route = await Route.create({
          routeId: uuidv4(),
          routeNumber: `${city.charAt(0).toUpperCase()}-${String(Math.floor(Math.random() * 900) + 100)}`,
          routeName: `${city.toUpperCase()} Main Route - Stops ${routeStops.length}`,
          description: `Main bus route connecting ${routeStops.length} stops in ${city}`,
          waypoints: waypoints,
          stops: routeStops.map((stop, index) => ({
            stopId: stop.stopId,
            stopName: stop.stopName,
            latitude: stop.latitude,
            longitude: stop.longitude,
            stopOrder: index,
            dwellTime: 3000,
          })),
          totalDistance: parseFloat(totalDistance.toFixed(2)),
          estimatedDuration: Math.ceil(totalDistance / 30 * 60), // ~30 km/h average
          isActive: true,
          createdAt: new Date(),
        });

        console.log(`   ✓ Created route: ${route.routeNumber}`);
        totalRoutes++;
      }
    }

    // Create some buses
    console.log(`\n🚌 Creating buses...`);
    const busTypes = ['AC', 'NON-AC', 'SEMI-AC'];
    const drivers = [
      { name: 'Rajesh Kumar', phone: '+91-98765-43210' },
      { name: 'Priya Singh', phone: '+91-98765-43211' },
      { name: 'Amit Patel', phone: '+91-98765-43212' },
      { name: 'Suresh Reddy', phone: '+91-98765-43213' },
      { name: 'Kavita Sharma', phone: '+91-98765-43214' },
    ];

    const routes = await Route.find();
    let busCounter = 1001;

    const buses = await Bus.insertMany(
      routes.map((route, index) => ({
        busId: uuidv4(),
        busNumber: `TN-01-AB-${busCounter + index}`,
        busType: busTypes[index % 3],
        capacity: 50 + (index * 5),
        driverName: drivers[index % drivers.length].name,
        phone: drivers[index % drivers.length].phone,
        assignedRoute: route._id,
        status: 'running',
        isActive: true,
        currentPosition: {
          latitude: route.waypoints[0].latitude,
          longitude: route.waypoints[0].longitude,
        },
        currentPassengers: 0,
        createdAt: new Date(),
      }))
    );

    console.log(`✓ Created ${buses.length} buses\n`);

    // Summary
    console.log('═══════════════════════════════════════════');
    console.log('✅ DATABASE SEEDING COMPLETED');
    console.log('═══════════════════════════════════════════');
    console.log(`📍 Total Stops Created: ${totalStops}`);
    console.log(`🛣️  Total Routes Created: ${totalRoutes}`);
    console.log(`🚌 Total Buses Created: ${buses.length}`);
    console.log('═══════════════════════════════════════════\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();
