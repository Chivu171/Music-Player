const express = require('express');
const router  = express.Router();
const streamController = require('../controllers/StreamController');

// GET /api/stream/song/:id
router.get('/song/:id', streamController.streamSong);

module.exports = router;