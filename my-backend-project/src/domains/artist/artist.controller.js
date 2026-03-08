const ArtistService = require('./artist.service');

const getAllArtists = async (req, res) => {
    try {
        const artists = await ArtistService.getAllArtists();
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getArtistById = async (req, res) => {
    try {
        const artist = await ArtistService.getArtistById(req.params.id);
        res.status(200).json(artist);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createArtist = async (req, res) => {
    try {
        const artist = await ArtistService.createArtist(req.body);
        res.status(201).json(artist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getTrendingArtists = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const artists = await ArtistService.getTrendingArtists(limit);
        res.status(200).json(artists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllArtists, getArtistById, createArtist, getTrendingArtists };
