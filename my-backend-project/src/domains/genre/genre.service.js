const Genre = require('./genre.model');
const { getOrSetCache, clearCache } = require('../../shared/utils/cache');

const getAllGenres = async () => {
    return await getOrSetCache('genres:all', async () => {
        return await Genre.find();
    });
};

const getGenreById = async (id) => {
    const genre = await Genre.findById(id);
    if (!genre) throw new Error('Genre not found');
    return genre;
};

const createGenre = async (genreData) => {
    const newGenre = new Genre(genreData);
    const saved = await newGenre.save();
    await clearCache('genres:all');
    return saved;
};

const updateGenre = async (id, updateData) => {
    return await Genre.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteGenre = async (id) => {
    return await Genre.findByIdAndDelete(id);
};

module.exports = { getAllGenres, getGenreById, createGenre, updateGenre, deleteGenre };
