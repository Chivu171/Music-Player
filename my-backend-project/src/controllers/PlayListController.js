const PlayListService = require('../services/PlayListService');

const createPlayList = async (req,res)=>{
    try{
        const playlist = await PlayListService.createPlayList(req.body, req.user.id);
        res.status(201).json({ message: 'Playlist was successfully created!', playlist });
    }
    catch(error){
        res.status(400).json({ message: error.message });
    }
}

const addSong = async(req,res)=>{
    try{
        const { playlistId, songId } = req.body;

        const playlist  = await PlayListService.addSongToPlayList(playlistId, songId)
        res.status(200).json({ message: 'The song was added', playlist: playlist });

    }
    catch(error){
        res.status(400).json({ message: error.message });

    }
}
const getById = async (req, res) => {
    try {
      const playlist = await PlayListService.getPlayListByID(req.params.id);
      res.status(200).json(playlist);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  const removeSong = async (req, res) => {
    try {
      const { playlistId, songId } = req.body;
      const updatedPlaylist = await PlayListService.removeSongFromPlaylist(playlistId, songId);
      res.status(200).json({ message: 'Xóa bài hát thành công!', playlist: updatedPlaylist });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const getUserPlaylists = async (req, res) => {
    try {
      const userId = req.user._id; // Lấy ID từ user đã được xác thực
      const playlists = await playListService.getUserPlaylists(userId);
      res.status(200).json(playlists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = {
    createPlayList,
    getById,
    addSong,
    removeSong,
    getUserPlaylists,
  };