const express = require('express');
const router = express.Router();
const artistController = require('../controllers/ArtistController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', isAuthenticated, isAdmin, artistController.createArtist);

module.exports = router;
