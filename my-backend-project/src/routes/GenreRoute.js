const express = require('express');
const router = express.Router();
const genreController = require('../controllers/GenreController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', isAuthenticated, isAdmin, genreController.createGenre);

module.exports = router;
