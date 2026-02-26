
const Song = require('../models/SongModel');

const getAllSong = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const songs = await Song.find().skip(skip).limit(limit);
  const total = await Song.countDocuments();

  if (!songs || songs.length === 0) {
    throw new Error('Song not found');
  }
  return { songs, total, page, totalPages: Math.ceil(total / limit) };
}

const incrementListenCount = async (songId) => {
  const song = await Song.findByIdAndUpdate(
    songId,
    { $inc: { dailyListen: 1, totalListen: 1 } },
    { new: true }
  );
  if (!song) {
    throw new Error('Song not found');
  }
  return song;
}

const getPopularSongs = async (limit = 10) => {
  const songs = await Song.find().sort({ totalListen: -1 }).limit(limit);
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

module.exports = { getAllSong, searchSongs, getDetailSongs, incrementListenCount, getPopularSongs };