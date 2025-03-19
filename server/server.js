// const express =require('express');
// const mongoose = require('mongoose'); 

// const roomRoutes = require('./Routes/roomRoutes');
// const connectDB = require('./config/db');
// const setupSocket = require('./config/socket')


// const app = express();

// const server=http.createServer(app)
// const io = setupSocket(server)
// const port = 3000;


// require('dotenv').config();
// connectDB();


// app.use(express.json())
// app.use('/',roomRoutes)


// app.post('/ping',(req,res)=>{
//     res.send('pong')
// })

// app.get('/', (req, res) => {
//     try {
//         const dbStatus = mongoose.connection.readyState;
//         const statusMessage = dbStatus === 1 ? 'Database Connected' : 'Database Not Connected';
//         res.send(statusMessage);
//     } catch (error) {
//         res.status(500).send('Error checking database status');
//     }
//      });
// app.listen(port,()=>{
//     console.log(`Server is running on port ${port}`)
// })
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const roomRoutes = require('./Routes/roomRoutes');
const connectDB = require('./config/db');
const setupSocket = require('./socket'); // Import setupSocket

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = setupSocket(server); // Initialize Socket.IO

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