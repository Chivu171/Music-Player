const PlayListService = require('./playlist.service');
const { cloudinary } = require('../../infrastructure/middleware/uploadMiddleware');
const streamifier = require('streamifier');


const createUserPlaylist = async (req, res) => {
  try {
    const playlist = await PlayListService.createUserPlaylist(req.body, req.user.id);
    res.status(201).json({ message: 'Playlist đã được tạo thành công!', playlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const createAlbum = async (req, res) => {
  try {
    let thumbnailUrl = null;

    if (req.file) {
      // Upload ảnh bìa lên Cloudinary qua buffer stream
      thumbnailUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'album-covers', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    }

    const album = await PlayListService.createAlbum(req.body, req.user.id, thumbnailUrl);
    res.status(201).json({ message: 'Album đã được tạo thành công!', album });
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};


const updatePlayList = async (req, res) => {
  try {
    const updated = await PlayListService.updatePlayList(req.params.id, req.body, req.user.id);
    res.status(200).json({ message: 'Cập nhật Playlist thành công!', playlist: updated });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deletePlayList = async (req, res) => {
  try {
    await PlayListService.deletePlayList(req.params.id, req.user.id);
    res.status(200).json({ message: 'Đã xóa Playlist thành công!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const addSong = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await PlayListService.addSongToPlayList(playlistId, songId, req.user.id);
    res.status(200).json({ message: 'Đã thêm bài hát vào Playlist!', playlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const removeSong = async (req, res) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await PlayListService.removeSongFromPlaylist(playlistId, songId, req.user.id);
    res.status(200).json({ message: 'Đã xóa bài hát khỏi Playlist!', playlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getUserPlaylists = async (req, res) => {
  try {
    const playlists = await PlayListService.getUserPlaylist(req.user.id);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllAlbums = async (req, res) => {
  try {
    const { artistName } = req.query;
    const albums = await PlayListService.getAllAlbums(artistName);
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getById = async (req, res) => {
  try {
    const playlist = await PlayListService.getPlayListByID(req.params.id);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


const triggerPopularToday = async (req, res) => {
  try {
    // Có thể bổ sung check admin ở đây hoặc ở router middleware
    const popular = await PlayListService.createPopularToday(req.user.id);
    res.status(200).json({ message: 'Đã cập nhật Popular Today!', playlist: popular });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const shuffle = async (req, res) => {
  try {
    const songs = await PlayListService.shuffleSongs(req.params.id);
    res.status(200).json(songs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createUserPlaylist,
  createAlbum,
  updatePlayList,
  deletePlayList,
  addSong,
  removeSong,
  getUserPlaylists,
  getAllAlbums,
  getById,
  triggerPopularToday,
  shuffle,
};