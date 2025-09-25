// frontend/src/utils/socket.js
import { io } from 'socket.io-client';

// Use import.meta.env instead of process.env in Vite
const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
  transports: ['websocket'], // Prefer WebSocket
});

// Optional: Add connection debugging
socket.on('connect', () => {
  console.log('✅ Socket.IO connected to server');
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket.IO connection error:', error);
});

export default socket;