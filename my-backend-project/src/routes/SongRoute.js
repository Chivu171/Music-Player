const express = require('express');
const router = express.Router();
const songController = require('../controllers/SongController');


// GET /api/songs
router.get('/getsongs', songController.getAllSongs);

// GET /api/songs/search?q=...
router.get('/search', songController.searchSongs);

// GET /api/songs/:id
router.get('/:id', songController.getDetailSongs);

module.exports = router;
