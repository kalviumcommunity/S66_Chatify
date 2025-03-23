const socketIo = require('socket.io');

const setupSocket = (server) =>{
    const io = socketIo(server)

    io.on('connection', (socket)=>{
        console.log('User Connected', socket.id )

        socket.on('joinRoom', (roomCode)=>{
            socket.join(roomCode);
            console.log(`User ${socket.id} joined the room ${roomCode} `)
        } );

        socket.on('sendMessage' , (data)=>{
            io.to(data.roomCode).emit('receiveMessage', data )
        } )

        socket.on('disconnect', ()=>{
            console.log('User disconnected',socket.id)
        } )
    } )
    return io;
}

module.exports=setupSocket;