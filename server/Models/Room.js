const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;