import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user joining
  socket.on('user-join', (userData) => {
    connectedUsers.set(socket.id, userData);
    socket.broadcast.emit('user-joined', userData);
    
    // Send current users list to the new user
    const usersList = Array.from(connectedUsers.values());
    socket.emit('users-list', usersList);
    
    // Broadcast updated users list to all clients
    io.emit('users-list', usersList);
    
    console.log(`${userData.username} joined the chat`);
    console.log('Current users:', usersList.map(u => u.username));
  });

  // Handle messages
  socket.on('message', (message) => {
    io.emit('message', message);
    console.log(`Message from ${message.user.username}: ${message.content}`);
  });

  // Handle user leaving
  socket.on('user-leave', (userData) => {
    // Remove user from connectedUsers
    connectedUsers.forEach((value, key) => {
      if (value.id === userData.id) {
        connectedUsers.delete(key);
      }
    });
    socket.broadcast.emit('user-left', userData);

    // Broadcast updated users list to all clients
    const usersList = Array.from(connectedUsers.values());
    io.emit('users-list', usersList);

    console.log(`${userData.username} left the chat`);
  });

  socket.on('disconnect', () => {
    const userData = connectedUsers.get(socket.id);
    if (userData) {
      connectedUsers.delete(socket.id);
      socket.broadcast.emit('user-left', userData);

      // Broadcast updated users list to all clients
      const usersList = Array.from(connectedUsers.values());
      io.emit('users-list', usersList);

      console.log(`${userData.username} disconnected`);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
