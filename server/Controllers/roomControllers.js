const Room = require('../Models/Room');
 const createRoom = async (req, res) => {
  try {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const room = new Room({
      code: roomCode,
      messages: []
    });
    await room.save();
    res.status(201).json({ roomCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.roomCode });
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json({ messages: room.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {createRoom, getRoom};