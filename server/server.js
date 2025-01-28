const express =require('express');
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

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})