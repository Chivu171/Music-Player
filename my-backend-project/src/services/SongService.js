
const Song = require('../models/SongModel');

const getAllSong = async () => {
  const songs = await Song.find();
  if (!songs || songs.length === 0) {
    throw new Error('Song not found');

  }
  return songs;
}
const searchSongs = async (query) => {
  const songs = await Song.find({
    $or: [
      { title: { $regex: query, $options: 'i' } }, // 'i' là không phân biệt hoa thường
      { artist: { $regex: query, $options: 'i' } }
    ]
  });
  return songs;
}

const getDetailSongs = async (songId) => {
  const song = await Song.findById(songId);
  if (!song) {
    throw new Error('Song not found');
  }
  return song;
}



module.exports = { getAllSong, searchSongs, getDetailSongs };