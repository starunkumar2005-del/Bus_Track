/**
 * Socket.io Service
 * Handles real-time communication with the backend
 */
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket) return;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.emit('connected', { socketId: this.socket.id });
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.emit('disconnected');
    });

    this.socket.on('bus_update', (data) => {
      this.emit('bus_update', data);
    });

    this.socket.on('bus_arrived', (data) => {
      this.emit('bus_arrived', data);
    });

    this.socket.on('bus_departed', (data) => {
      this.emit('bus_departed', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomName) {
    if (this.socket) {
      this.socket.emit('join_room', { roomName });
    }
  }

  getBusLocation(busId) {
    if (this.socket) {
      this.socket.emit('get_bus_location', busId);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

const socketService = new SocketService();
export default socketService;
