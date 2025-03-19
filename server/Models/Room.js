const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  user: {
    type: String, // Supabase user ID or guest username
    required: true
  },
  isGuest: {
    type: Boolean,
    default: false
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
    unique: true // This implicitly creates an index
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Remove the duplicate index definition for 'code'
roomSchema.index({ createdAt: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;