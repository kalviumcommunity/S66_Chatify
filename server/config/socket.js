

const socketIo = require('socket.io');
const Room = require('../Models/Room');

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: ['https://chatify-eight-rouge.vercel.app', 'https://s66-chatify.onrender.com'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`User Connected: ${socket.id}`);

        socket.on('joinRoom', async (roomCode) => {
            socket.join(roomCode);
            console.log(`User ${socket.id} joined room ${roomCode}`);

            // Fetch previous messages from MongoDB
            try {
                const room = await Room.findOne({ code: roomCode });
                if (room && room.messages.length > 0) {
                    console.log('✅ Sending previous messages:', room.messages);
                    socket.emit('previousMessages', room.messages.map(msg => ({
                        user: msg.user,
                        message: msg.message
                    })));
                } else {
                    console.log('⚠️ No messages found for room:', roomCode);
                }
            } catch (error) {
                console.error('❌ Error fetching messages:', error);
            }
        });

        socket.on('sendMessage', async (data) => {
            console.log('Received sendMessage event:', data);
            const { roomCode, user, message } = data;

            try {
                const room = await Room.findOneAndUpdate(
                    { code: roomCode },
                    { 
                        $push: { messages: { user, message, timestamp: new Date() } },
                        $set: { lastActive: new Date() }
                    },
                    { new: true, upsert: true }
                );

                const messageData = { user, message };
                io.to(roomCode).emit('receiveMessage', messageData);
                console.log(`Broadcasting receiveMessage to room ${roomCode}:`, messageData);
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

module.exports = setupSocket;