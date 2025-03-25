const express = require('express');
const authMiddleware= require('../middleware/auth')

const { createRoom,getRoom, deleteRoom } = require('../Controllers/roomControllers'); 


const router = express.Router();

router.post('/create', authMiddleware, createRoom);
router.get('/roomcode/:roomCode', authMiddleware, getRoom);
router.get('/roomcode/:roomCode', deleteRoom)



module.exports = router;