const express = require('express');
const router  = express.Router();
const songController = require('../controllers/SongController');


// GET /api/songs
router.get('/getsongs', songController.getAllSongs);

module.exports = router;
