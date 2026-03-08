const Song = require('./song.model');
const Artist = require('../artist/artist.model');
const Genre = require('../genre/genre.model');
const cloudinary = require('../../infrastructure/config/cloudinary');

const getAllSong = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const songs = await Song.find()
    .populate(['artist', 'genre'])
    .skip(skip)
    .limit(limit);
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
  ).populate(['artist', 'genre']);

  if (!song) {
    throw new Error('Song not found');
  }
  return song;
}

const getPopularSongs = async (limit = 10) => {
  const songs = await Song.find()
    .sort({ totalListen: -1 })
    .limit(limit)
    .populate(['artist', 'genre']);
  return songs;
}
const searchSongsByGenre = async (genreName) => {
  const genre = await Genre.findOne({
    name: { $regex: genreName, $options: 'i' }
  });
  if (!genre) {
    return [];
  }
  const songs = await Song.find({
    genre: genre._id
  }).populate(['artist']);

  return songs;

}

const searchSongs = async (query) => {
  // Tìm các artist có tên khớp với query
  const artists = await Artist.find({
    name: { $regex: query, $options: 'i' }
  });
  const artistIds = artists.map(a => a._id);

  const songs = await Song.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { artist: { $in: artistIds } }
    ]
  }).populate(['artist', 'genre']);

  return songs;
}

const getDetailSongs = async (songId) => {
  const song = await Song.findById(songId).populate(['artist', 'genre']);
  if (!song) {
    throw new Error('Song not found');
  }
  return song;
}

const deleteSong = async (songId) => {
  const song = await Song.findById(songId);
  if (!song) {
    throw new Error('Song not found');
  }

  if (song.cloudinaryId) {
    try {
      // 'video' dùng cho cả audio/music trên Cloudinary
      await cloudinary.uploader.destroy(song.cloudinaryId, { resource_type: 'video' });
    } catch (err) {
      console.error('Cloudinary delete error:', err);
    }
  }

  //Xóa trong DB
  await Song.findByIdAndDelete(songId);

  return { message: 'Song deleted successfully from DB and Cloudinary' };
}

module.exports = { getAllSong, searchSongs, getDetailSongs, incrementListenCount, getPopularSongs, deleteSong, searchSongsByGenre };