import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.REACT_APP_REMOTE_ADDRESS, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });
    console.log("Connected to ", process.env.REACT_APP_REMOTE_ADDRESS)
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.socket.emit('join-user');
      this.emit('connection_status', { status: 'connected' });
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.emit('connection_status', { status: 'disconnected' });
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      this.emit('connection_status', { 
        status: 'error', 
        error: error.message,
        attempts: this.reconnectAttempts 
      });
    });

    this.socket.on('reconnect', () => {
      this.socket.emit('join-user');
      this.emit('connection_status', { status: 'reconnected' });
    });

    // Handle direct message notifications
    this.socket.on('direct_message', (data) => {
      console.log("Direct message notification received:", data);
      if (data.type === 'new_message_notification') {
        this.emit('new_message_notification', data);
      }
    });
  }

  joinRoom(otherUserId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-room', otherUserId);
    }
  }

  leaveRoom(otherUserId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-room', otherUserId);
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export const socketService = new SocketService(); 