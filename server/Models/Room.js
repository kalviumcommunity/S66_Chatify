// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   message: {
//     type: String,
//     required: true
//   },
//   user: {
//     type: String,
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// });

// const roomSchema = new mongoose.Schema({
//   code: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   messages: [messageSchema],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Room = mongoose.model('Room', roomSchema);  
// module.exports = Room;
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
    unique: true
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

roomSchema.index({ code: 1 });
roomSchema.index({ createdAt: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;