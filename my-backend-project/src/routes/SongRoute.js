const express = require('express');
const router = express.Router();
const songController = require('../controllers/SongController');


// GET /api/songs
router.get('/getsongs', songController.getAllSongs);

// GET /api/songs/search?q=...
router.get('/search', songController.searchSongs);

// GET /api/songs/:id
router.get('/:id', songController.getDetailSongs);

// POST /api/songs/listen/:id
router.post('/listen/:id', songController.incrementListenCount);

// GET /api/songs/popular
router.get('/popular', songController.getPopularSongs);

module.exports = router;
