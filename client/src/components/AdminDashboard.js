/**
 * Admin Dashboard Component
 * Manage routes, buses, and schedules
 */
import React, { useState, useEffect } from 'react';
import { routeService, stopService } from '../services/api';
import '../styles/admin.css';

export default function AdminDashboard() {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [activeTab, setActiveTab] = useState('routes');
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [routesRes, stopsRes] = await Promise.all([
        routeService.getAllRoutes(),
        stopService.getAllStops(),
      ]);
      setRoutes(routesRes.data);
      setStops(stopsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      routeName: formData.get('routeName'),
      routeNumber: formData.get('routeNumber'),
      waypoints: JSON.parse(formData.get('waypoints')),
      stops: formData.get('stops') ? JSON.parse(formData.get('stops')) : [],
    };

    try {
      await routeService.createRoute(data);
      alert('Route created successfully!');
      loadAllData();
      e.target.reset();
    } catch (error) {
      alert('Error creating route: ' + error.message);
    }
  };

  const handleCreateStop = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      stopName: formData.get('stopName'),
      latitude: parseFloat(formData.get('latitude')),
      longitude: parseFloat(formData.get('longitude')),
      city: formData.get('city'),
    };

    try {
      await stopService.createStop(data);
      alert('Stop created successfully!');
      loadAllData();
      e.target.reset();
    } catch (error) {
      alert('Error creating stop: ' + error.message);
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          Routes ({routes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'stops' ? 'active' : ''}`}
          onClick={() => setActiveTab('stops')}
        >
          Stops ({stops.length})
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {activeTab === 'routes' && (
        <div className="admin-section">
          <h2>📍 STEP 1: Routes (Create First)</h2>
          <p className="order-info">⚠️ Create routes first, then add stops, then create buses</p>

          <form onSubmit={handleCreateRoute} className="form-section">
            <h3>Add New Route</h3>
            <div className="form-group">
              <input
                type="text"
                name="routeName"
                placeholder="Route Name (e.g., Main Route)"
                required
              />
              <input
                type="text"
                name="routeNumber"
                placeholder="Route Number (e.g., 101)"
                required
              />
              <input
                type="text"
                name="waypoints"
                placeholder='Waypoints (JSON: [{"lat": 11.0, "lng": 79.0}, {"lat": 11.1, "lng": 79.1}])'
                required
              />
              <input
                type="text"
                name="stops"
                placeholder="Stops (JSON array of stop IDs, leave empty for now)"
              />
              <button type="submit">Create Route</button>
            </div>
          </form>

          <table>
            <thead>
              <tr>
                <th>Route #</th>
                <th>Name</th>
                <th>Distance (km)</th>
                <th>Duration (min)</th>
                <th>Stops</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route._id}>
                  <td>{route.routeNumber}</td>
                  <td>{route.routeName}</td>
                  <td>{route.totalDistance?.toFixed(2) || 'N/A'}</td>
                  <td>{route.estimatedDuration || 'N/A'}</td>
                  <td>{route.stops?.length || 0}</td>
                  <td>{route.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'stops' && (
        <div className="admin-section">
          <h2>🛑 STEP 2: Stops (Create After Routes)</h2>
          {routes.length > 0 ? (
            <p className="order-info">✅ Routes created. Now add stops for bus operations</p>
          ) : (
            <p className="order-warning">⚠️ Create routes first!</p>
          )}

          <form onSubmit={handleCreateStop} className="form-section">
            <h3>Add New Stop</h3>
            <div className="form-group">
              <input
                type="text"
                name="stopName"
                placeholder="Stop Name (e.g., Central Station)"
                required
              />
              <input
                type="number"
                name="latitude"
                placeholder="Latitude (e.g., 11.0123456)"
                step="0.0000001"
                min="-90"
                max="90"
                required
              />
              <input
                type="number"
                name="longitude"
                placeholder="Longitude (e.g., 79.0123456)"
                step="0.0000001"
                min="-180"
                max="180"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City (e.g., Chennai)"
                required
              />
              <button type="submit">Create Stop</button>
            </div>
          </form>

          <table>
            <thead>
              <tr>
                <th>Stop Name</th>
                <th>City</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Routes</th>
              </tr>
            </thead>
            <tbody>
              {stops.map(stop => (
                <tr key={stop._id}>
                  <td>{stop.stopName}</td>
                  <td>{stop.city || 'N/A'}</td>
                  <td>{stop.latitude.toFixed(7)}</td>
                  <td>{stop.longitude.toFixed(7)}</td>
                  <td>{stop.routes?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
