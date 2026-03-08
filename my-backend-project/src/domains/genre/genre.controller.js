const GenreService = require('./genre.service');

const getAllGenres = async (req, res) => {
    try {
        const genres = await GenreService.getAllGenres();
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getGenreById = async (req, res) => {
    try {
        const genre = await GenreService.getGenreById(req.params.id);
        res.status(200).json(genre);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createGenre = async (req, res) => {
    try {
        const genre = await GenreService.createGenre(req.body);
        res.status(201).json(genre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getAllGenres, getGenreById, createGenre };
