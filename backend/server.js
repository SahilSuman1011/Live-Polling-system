// backend/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with proper CORS for WebSocket connections
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true // Important for cookies/sessions if needed later
  }
});

// Configure Express middleware for standard HTTP requests
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend origin
  credentials: true
}));
app.use(express.json());

// Import the state management module
const state = require('./utils/state.js');

// Socket connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Import and call the handler function, passing the socket instance and io
  // This should only happen once per connection
  require('./utils/socketHandlers')(socket, io, state);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Cleanup on disconnect - remove participant and answer
    state.removeParticipant(socket.id);
    delete state.getAnswers()[socket.id]; // Delete specific answer
    io.emit('updateParticipants', state.getParticipants());
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});