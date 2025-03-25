

const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const roomRoutes = require('./Routes/roomRoutes');
const connectDB = require('./config/db');
const setupSocket = require('./config/socket');

const app = express();
const server = http.createServer(app);

require('dotenv').config();
connectDB();

// Enable CORS for HTTP requests
app.use(cors({
    origin: ['https://chatify-eight-rouge.vercel.app', 'https://s66-chatify.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Initialize Socket.io
const io = setupSocket(server);

// Middleware to parse JSON requests
app.use(express.json());

// Routes
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

// Start server
server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});