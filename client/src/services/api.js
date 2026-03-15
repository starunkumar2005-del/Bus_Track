/**
 * API Service
 * Handles all API calls to the backend
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Routes
export const routeService = {
  getAllRoutes: () => api.get('/routes'),
  getRouteById: (id) => api.get(`/routes/${id}`),
  createRoute: (data) => api.post('/routes', data),
  updateRoute: (id, data) => api.put(`/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/routes/${id}`),
};

// Buses
export const busService = {
  getAllBuses: () => api.get('/buses'),
  getBusById: (id) => api.get(`/buses/${id}`),
  createBus: (data) => api.post('/buses', data),
  updateBus: (id, data) => api.put(`/buses/${id}`, data),
  deleteBus: (id) => api.delete(`/buses/${id}`),
  getBusLocation: (id) => api.get(`/buses/${id}/location`),
  assignBusToRoute: (id, routeId) => api.post(`/buses/${id}/assign-route`, { routeId }),
};

// Stops
export const stopService = {
  getAllStops: () => api.get('/stops'),
  getStopById: (id) => api.get(`/stops/${id}`),
  createStop: (data) => api.post('/stops', data),
  updateStop: (id, data) => api.put(`/stops/${id}`, data),
  deleteStop: (id) => api.delete(`/stops/${id}`),
};

// Schedules
export const scheduleService = {
  getAllSchedules: () => api.get('/schedules'),
  getScheduleById: (id) => api.get(`/schedules/${id}`),
  createSchedule: (data) => api.post('/schedules', data),
  updateSchedule: (id, data) => api.put(`/schedules/${id}`, data),
  deleteSchedule: (id) => api.delete(`/schedules/${id}`),
  getBusSchedule: (busId) => api.get(`/schedules/bus/${busId}`),
};

export default api;
