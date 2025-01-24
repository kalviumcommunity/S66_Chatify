const express =require('express');
const app = express();
const port = 3000;

app.use(express.json())

app.post('/ping',(req,res)=>{
    res.send('pong')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})