
// })
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const roomRoutes = require('./Routes/roomRoutes');
const connectDB = require('./config/db');
const setupSocket = require('./config/socket')

const app = express();
const server = http.createServer(app); 
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173/chat', // Replace with your client's URL
      methods: ['GET', 'POST'],
    },
  });

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