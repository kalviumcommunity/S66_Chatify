const express = require('express');
const { createRoom,getRoom } = require('../Controllers/roomControllers'); 

const router = express.Router();

router.post('/create', createRoom);
router.get('/roomcode/:roomCode', getRoom);

module.exports = router;