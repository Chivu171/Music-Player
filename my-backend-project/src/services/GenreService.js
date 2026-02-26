const Genre = require('../models/Genre');

const getAllGenres = async () => {
    return await Genre.find().populate('songs');
};

const getGenreById = async (id) => {
    const genre = await Genre.findById(id).populate('songs');
    if (!genre) throw new Error('Genre not found');
    return genre;
};

const createGenre = async (genreData) => {
    const newGenre = new Genre(genreData);
    return await newGenre.save();
};

const updateGenre = async (id, updateData) => {
    return await Genre.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteGenre = async (id) => {
    return await Genre.findByIdAndDelete(id);
};

module.exports = { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre };
