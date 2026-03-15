/**
 * Collection of utility functions for the application
 */

/**
 * Calculate distance between two geographic points using Haversine formula
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns distance in km
};

/**
 * Format time for display
 */
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (lat, lng) => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

/**
 * Get bearing color based on direction
 */
export const getBearingColor = (bearing) => {
  if (bearing < 45 || bearing >= 315) return 'North';
  if (bearing < 135) return 'East';
  if (bearing < 225) return 'South';
  return 'West';
};

/**
 * Calculate speed from distance and time
 */
export const calculateSpeed = (distanceKm, timeSeconds) => {
  return ((distanceKm * 3600) / timeSeconds).toFixed(2); // km/h
};

/**
 * Validate coordinates
 */
export const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

/**
 * Check if two coordinates are near each other
 */
export const isNear = (lat1, lng1, lat2, lng2, thresholdKm = 0.05) => {
  const distance = calculateDistance(lat1, lng1, lat2, lng2);
  return distance <= thresholdKm;
};

export default {
  calculateDistance,
  formatTime,
  formatCoordinates,
  getBearingColor,
  calculateSpeed,
  isValidCoordinates,
  isNear,
};
