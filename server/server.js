const express =require('express');
const mongoose = require('mongoose'); 

const roomRoutes = require('./Routes/roomRoutes');
const app = express();
const port = 3000;
const connectDB = require('./config/db');

require('dotenv').config();
connectDB();


app.use(express.json())
app.use('/',roomRoutes)


app.post('/ping',(req,res)=>{
    res.send('pong')
})

app.get('/', (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState;
        const statusMessage = dbStatus === 1 ? 'Database Connected' : 'Database Not Connected';
        res.send(statusMessage);
    } catch (error) {
        res.status(500).send('Error checking database status');
    }
     });
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})