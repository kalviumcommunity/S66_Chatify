const express = require('express');
const { createRoom,getRoom, deleteRoom } = require('../Controllers/roomControllers'); 

const router = express.Router();

router.post('/create', createRoom);
router.get('/roomcode/:roomCode', getRoom);
router.get('/roomcode/:roomCode', deleteRoom)



module.exports = router;