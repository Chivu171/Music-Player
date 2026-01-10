const Song = require('../models/SongModel');
const SongService = require('../services/SongService');

const getSongPathById = async(songID)=>{
    const song = await Song.findById(songID);
    if (!song) {
      throw new Error('Song not found');
    }
    return song.filePath;
}

const getAllSongs = async (req, res) => {
    try {
        const songs = await SongService.getAllSong();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSongPathById, getAllSongs };