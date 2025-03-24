const socketIo = require('socket.io');
const Room = require('../Models/Room'); // Import Room model

const setupSocket = (server) => {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('User Connected', socket.id);

        socket.on('joinRoom', async (roomCode) => {
            socket.join(roomCode);
            console.log(`User ${socket.id} joined the room ${roomCode}`);

            // Fetch previous messages from MongoDB
            try {
                const room = await Room.findOne({ code: roomCode });
                if (room) {
                    socket.emit('previousMessages', room.messages);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        });

        socket.on('sendMessage', async (data) => {
            const { roomCode, user, message } = data;

            // Save message to MongoDB
            try {
                const room = await Room.findOneAndUpdate(
                    { code: roomCode },
                    { 
                        $push: { messages: { user, message, timestamp: new Date() } },
                        $set: { lastActive: new Date() }
                    },
                    { new: true, upsert: true }
                );

                // Send message to all users in the room
                io.to(roomCode).emit('receiveMessage', { user, message });
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });

    return io;
};

module.exports = setupSocket;
