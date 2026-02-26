const Song = require('../models/SongModel');
const SongService = require('../services/SongService');

const getSongPathById = async (songID) => {
    const song = await Song.findById(songID);
    if (!song) {
        throw new Error('Song not found');
    }
    return song.filePath;
}

const getAllSongs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await SongService.getAllSong(page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const incrementListenCount = async (req, res) => {
    try {
        const songId = req.params.id;
        const song = await SongService.incrementListenCount(songId);
        res.status(200).json({ message: 'Listen count incremented', song });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getPopularSongs = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const songs = await SongService.getPopularSongs(limit);
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const searchSongs = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: 'Missing search query' });
        }
        const songs = await SongService.searchSongs(query);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getDetailSongs = async (req, res) => {
    try {
        const songId = req.params.id;
        const song = await SongService.getDetailSongs(songId);
        res.status(200).json(song);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports = { getSongPathById, getAllSongs, searchSongs, getDetailSongs, incrementListenCount, getPopularSongs };