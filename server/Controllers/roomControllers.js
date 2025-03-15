const Room = require('../Models/Room');

const generateRoomCode = async () => {
  let roomCode;
  let roomExists = true;
  while (roomExists) {
    roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingRoom = await Room.findOne({ code: roomCode });
    if (!existingRoom) {
      roomExists = false;
    }
  }
  return roomCode;
};

const createRoom = async (req, res) => {
  try {
    const roomCode = await generateRoomCode();
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
    res.json({ message: 'Room found successfully', messages: room.messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async(req,res)=>{
  try {
    const room = await Room.findOne({code:req.params.roomCode})
    if (!room){
      return res.status(404).json({error:"Room not found"})
    }
    Room.findByIdAndDelete( room._id)
    res.status(200).json({message:"Room deleted succesfully"})
  } catch (error) {
    res.status(500).json({error:error.message})
    
  }
}

module.exports = { createRoom, getRoom,deleteRoom };
