// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const mongoose = require('mongoose');
// const socketIo = require('socket.io');
// const roomRoutes = require('./Routes/roomRoutes');
// const connectDB = require('./config/db');
// const setupSocket = require('./config/socket');

// const app = express();
// app.use(cors({
//   origin: ['https://chatify-eight-rouge.vercel.app', 'https://s66-chatify.onrender.com'], 
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


// const server = http.createServer(app);  // Create HTTP server
// const io = setupSocket(server); // Attach Socket.io to the server


// require('dotenv').config();
// connectDB();

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://chatify-eight-rouge.vercel.app');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// app.options('*', (req, res) => {
//   res.sendStatus(200);
// });


// app.use(express.json());
// app.use('/', roomRoutes);

// app.post('/ping', (req, res) => {
//   res.send('pong');
// });

// app.get('/', (req, res) => {
//   try {
//     const dbStatus = mongoose.connection.readyState;
//     const statusMessage = dbStatus === 1 ? 'Database Connected' : 'Database Not Connected';
//     res.send(statusMessage);
//   } catch (error) {
//     res.status(500).send('Error checking database status');
//   }
// });

// server.listen(3000, () => {
//   console.log(`Server is running on port 3000`);
// });

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io'); // Import Socket.io
const roomRoutes = require('./Routes/roomRoutes');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app); // Create HTTP server

require('dotenv').config();
connectDB();

// Enable CORS for Express
app.use(cors({
  origin: ['https://chatify-eight-rouge.vercel.app', 'https://s66-chatify.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: ['https://chatify-eight-rouge.vercel.app', 'https://s66-chatify.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware to set additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://chatify-eight-rouge.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Routes
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

// Start the server
server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
