const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const roomRoutes = require('./Routes/roomRoutes');
const connectDB = require('./config/db');
const setupSocket = require('./config/socket');

const app = express();
app.use(cors({
  origin: 'https://chatify-eight-rouge.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true 
}));

const server = http.createServer(app);  // Create HTTP server
const io = setupSocket(server); // Attach Socket.io to the server


require('dotenv').config();
connectDB();

app.use(express.json());
app.use('/', roomRoutes);

app.post('/ping', (req, res) => {
  res.send('pong');
});

app.get('/', (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusMessage = dbStatus === 1 ? 'Database Connected' : 'Database Not Connected';
    res.send(statusMessage);
  } catch (error) {
    res.status(500).send('Error checking database status');
  }
});

server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
