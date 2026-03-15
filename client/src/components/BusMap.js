/**
 * Bus Tracking Map Component
 * Displays buses on an interactive map using Leaflet
 */
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import socketService from '../services/socket';
import { busService, routeService, stopService } from '../services/api';
import '../styles/map.css';

// Custom bus marker icon
const busIcon = L.divIcon({
  html: `<div class="bus-marker">🚌</div>`,
  iconSize: [30, 30],
  className: 'custom-bus-marker',
});

// Waypoint marker icon
const waypointIcon = L.divIcon({
  html: `<div class="waypoint-marker">📍</div>`,
  iconSize: [25, 25],
  className: 'custom-waypoint-marker',
});

// Stop marker icon
const stopIcon = L.divIcon({
  html: `<div class="stop-marker">🛑</div>`,
  iconSize: [28, 28],
  className: 'custom-stop-marker',
});

// Map Control Component to manage map instance
function MapControlComponent({ mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
}

export default function BusMap() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Route colors for different routes
  const routeColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#B3E5FC'
  ];

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busesRes, routesRes, stopsRes] = await Promise.all([
          busService.getAllBuses(),
          routeService.getAllRoutes(),
          stopService.getAllStops(),
        ]);
        setBuses(busesRes.data);
        setRoutes(routesRes.data);
        setStops(stopsRes.data);
        console.log(`✅ Loaded ${routesRes.data.length} routes with ${stopsRes.data.length} stops`);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Connect to socket and listen for updates
  useEffect(() => {
    socketService.connect();
    socketService.joinRoom('all_buses');

    // Handle bus updates
    const handleBusUpdate = (data) => {
      setBuses(prevBuses =>
        prevBuses.map(bus =>
          bus._id === data.busId
            ? {
                ...bus,
                currentPosition: {
                  latitude: data.position.latitude,
                  longitude: data.position.longitude,
                },
              }
            : bus
        )
      );
    };

    // Handle bus arrival
    const handleBusArrived = (data) => {
      console.log(`Bus ${data.busNumber} arrived at stop ${data.stopName}`);
    };

    // Handle bus departure
    const handleBusDeparted = (data) => {
      console.log(`Bus ${data.busNumber} departed from stop`);
    };

    socketService.on('bus_update', handleBusUpdate);
    socketService.on('bus_arrived', handleBusArrived);
    socketService.on('bus_departed', handleBusDeparted);

    return () => {
      socketService.off('bus_update', handleBusUpdate);
      socketService.off('bus_arrived', handleBusArrived);
      socketService.off('bus_departed', handleBusDeparted);
    };
  }, []);



  if (loading) {
    return <div className="map-loading">Loading map...</div>;
  }

  // Function to zoom and pan map to route
  const zoomToRoute = (route) => {
    if (!route || !route.waypoints || route.waypoints.length === 0) return;

    const coordinates = route.waypoints.map(w => [w.latitude, w.longitude]);
    const bounds = L.latLngBounds(coordinates);
    
    if (mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  // Handle route selection with map zoom
  const handleRouteSelect = (e) => {
    const routeId = e.target.value;
    if (routeId === '') {
      setSelectedRoute(null);
      if (mapRef.current) {
        mapRef.current.setView([11.0168, 76.9558], 7);
      }
    } else {
      const route = routes.find(r => r._id === routeId);
      setSelectedRoute(route);
      zoomToRoute(route);
    }
  };

  // Get center coordinates (default to a city in Tamil Nadu)
  const defaultCenter = [11.0168, 76.9558]; // Coimbatore, TN

  return (
    <div className="map-container">
      <div className="map-controls">
        <h2>🗺️ Live Bus Tracking - Tamil Nadu</h2>
        <div className="controls-row">
          <div className="info-badge">
            📍 {routes.length} Routes | 🛑 {stops.length} Stops | 🚌 {buses.length} Buses Running
          </div>
          
          <div className="route-selector">
            <label>Select Route:</label>
            <select
              value={selectedRoute?._id || ''}
              onChange={handleRouteSelect}
            >
              <option value="">Show All Routes</option>
              {routes.map(route => (
                <option key={route._id} value={route._id}>
                  {route.routeNumber} - {route.routeName}
                </option>
              ))}
            </select>
          </div>
          {selectedRoute && (
            <div className="route-info-badge">
              Route: {selectedRoute.routeNumber} | Distance: {selectedRoute.totalDistance}km | Duration: {selectedRoute.estimatedDuration}min
            </div>
          )}
        </div>
      </div>

      <MapContainer
        ref={mapRef}
        center={defaultCenter}
        zoom={7}
        style={{ height: '600px', width: '100%' }}
      >
        <MapControlComponent mapRef={mapRef} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Display all routes or filtered route */}
        {routes.map((route, routeIndex) => {
          if (selectedRoute && route._id !== selectedRoute._id) {
            return null;
          }

          const color = routeColors[routeIndex % routeColors.length];

          return (
            <div key={route._id}>
              {/* Route polyline */}
              {route.waypoints && route.waypoints.length > 1 && (
                <Polyline
                  positions={route.waypoints.map(w => [w.latitude, w.longitude])}
                  color={color}
                  weight={3}
                  opacity={0.8}
                  dashArray="0"
                >
                  <Popup>
                    <div className="route-popup">
                      <strong>{route.routeNumber}</strong>
                      <p>{route.routeName}</p>
                      <p>Distance: {route.totalDistance} km</p>
                      <p>Duration: {route.estimatedDuration} min</p>
                      <p>Stops: {route.stops?.length || 0}</p>
                    </div>
                  </Popup>
                </Polyline>
              )}

              {/* Route stops */}
              {route.stops && route.stops.map((stop, idx) => (
                <Marker
                  key={`${route._id}-stop-${idx}`}
                  position={[stop.latitude, stop.longitude]}
                  icon={stopIcon}
                >
                  <Popup>
                    <div className="stop-popup">
                      <strong>🛑 {stop.stopName}</strong>
                      <p>Route: {route.routeNumber}</p>
                      <p>Stop #{stop.stopOrder + 1}</p>
                      <p>Dwell: {(stop.dwellTime / 1000).toFixed(0)}s</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </div>
          );
        })}

        {/* Display buses */}
        {buses.map(bus => {
          // Check if bus should be displayed
          const busRouteId = bus.assignedRoute?._id || bus.assignedRoute;
          
          if (selectedRoute && busRouteId !== selectedRoute._id) {
            return null;
          }

          return (
            <Marker
              key={bus._id}
              position={[
                bus.currentPosition.latitude,
                bus.currentPosition.longitude,
              ]}
              icon={busIcon}
              onClick={() => setSelectedBus(bus)}
            >
              <Popup>
                <div className="bus-popup">
                  <strong>🚌 {bus.busNumber}</strong>
                  <p>Status: {bus.status}</p>
                  <p>Driver: {bus.driverName || 'N/A'}</p>
                  <p>Passengers: {bus.currentPassengers}/{bus.capacity}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Bus Info Panel */}
      {selectedBus && (
        <div className="bus-info-panel">
          <div className="info-header">
            <h3>🚌 Bus Details</h3>
            <button onClick={() => setSelectedBus(null)}>×</button>
          </div>
          <div className="info-content">
            <p><strong>Bus Number:</strong> {selectedBus.busNumber}</p>
            <p><strong>Type:</strong> {selectedBus.busType}</p>
            <p><strong>Status:</strong> {selectedBus.status}</p>
            <p><strong>Driver:</strong> {selectedBus.driverName || 'N/A'}</p>
            <p><strong>Phone:</strong> {selectedBus.phone || 'N/A'}</p>
            <p><strong>Capacity:</strong> {selectedBus.capacity}</p>
            <p><strong>Current Passengers:</strong> {selectedBus.currentPassengers}</p>
            <p><strong>Position:</strong> {selectedBus.currentPosition.latitude.toFixed(4)}, {selectedBus.currentPosition.longitude.toFixed(4)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
