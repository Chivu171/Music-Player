const PlayList = require('../models/PlayListModel')

const Song = require('../models/SongModel'); // Cần để kiểm tra bài hát tồn tại


const createPlayList = async(playListData, userID) =>{
    const newPlayList = new PlayList({
        ...playListData,
        createdBy: userID, // Gán ID của người dùng đang đăng nhập
    })
    return await newPlayList.save();
}

const getPlayListByID = async(playListID) =>{
    // .populate() sẽ lấy toàn bộ thông tin chi tiết của bài hát thay vì chỉ ID
    const playList = await PlayList.findById(playListID).populate('songs');
    if (!playList){
        throw new Error('playList not found!');
    }
    return playList;

}

const addSongToPlayList = async(playlistId, songId)=>{
    const playlist = await PlayList.findById(playlistId);
  if (!playlist) {
    throw new Error('playList not found!');
  }
  const song = await Song.findById(songId);
  if (!song){
    throw new Error('Song not found!');
  }
  if (playlist.songs.includes(songId)){
    throw new Error('Song already in playlist');
  }
  playlist.songs.push(songId);
  return await playlist.save();

}
const removeSongFromPlaylist = async (playlistId, songId) => {
    const playlist = await PlayList.findById(playlistId);
    if (!playlist) {
      throw new Error('Không tìm thấy playlist.');
    }
    // Kéo (pull) bài hát ra khỏi mảng songs
    playlist.songs.pull(songId);
    return await playlist.save();
  };
  const getUserPlaylist = async (userID)=>{
    const playlists = await PlayList.find({ createdBy: userID });
    return playlists;
  }
  module.exports = {
    createPlayList,
    getPlayListByID,
    addSongToPlayList,
    removeSongFromPlaylist,
    getUserPlaylist,
  };