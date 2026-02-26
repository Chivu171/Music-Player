const PlayList = require('../models/PlayListModel');
const Song = require('../models/SongModel');
const User = require('../models/User');


const createUserPlaylist = async (playListData, userID) => {
  const newPlayList = new PlayList({
    ...playListData,
    type: 'user-playlist',
    createdBy: userID,
  });
  return await newPlayList.save();
};


const createAlbum = async (albumData, adminID) => {
  const admin = await User.findById(adminID);
  if (!admin || admin.role !== 'admin') {
    throw new Error('Chỉ Admin mới có quyền tạo Album.');
  }
  const newAlbum = new PlayList({
    ...albumData,
    type: 'album',
    createdBy: adminID,
  });
  return await newAlbum.save();
};


const createPopularToday = async (systemAdminID) => {
  // Lấy top 10 bài hát có lượt nghe trong ngày cao nhất
  const topSongs = await Song.find().sort({ dailyListen: -1 }).limit(10);
  const songIds = topSongs.map(song => song._id);

  let popularToday = await PlayList.findOne({ type: 'popular-today' });

  if (popularToday) {
    popularToday.songs = songIds;
    popularToday.name = `Popular Today - ${new Date().toLocaleDateString('vi-VN')}`;
    return await popularToday.save();
  } else {
    const newPopular = new PlayList({
      name: `Popular Today - ${new Date().toLocaleDateString('vi-VN')}`,
      type: 'popular-today',
      songs: songIds,
      createdBy: systemAdminID,
      description: 'Những bài hát thịnh hành nhất hôm nay.'
    });
    return await newPopular.save();
  }
};


/*const createRecommendation = async (userID, songIds) => {
  let recommendation = await PlayList.findOne({ createdBy: userID, type: 'recommendation' });

  if (recommendation) {
    recommendation.songs = songIds;
    return await recommendation.save();
  } else {
    const newRec = new PlayList({
      name: 'Gợi ý cho bạn',
      type: 'recommendation',
      createdBy: userID,
      songs: songIds,
      description: 'Danh sách bài hát được gợi ý riêng cho bạn dựa trên gu âm nhạc.'
    });
    return await newRec.save();
  }
};*/

const getPlayListByID = async (playListID) => {
  const playList = await PlayList.findById(playListID).populate('songs');
  if (!playList) {
    throw new Error('Không tìm thấy Playlist!');
  }
  return playList;
};
const updatePlayList = async (playlistId, updateData, userID) => {
  const playlist = await PlayList.findById(playlistId);
  if (!playlist) throw new Error('Không tìm thấy Playlist.');

  // Kiểm tra chính chủ
  if (playlist.createdBy.toString() !== userID.toString()) {
    throw new Error('Bạn không có quyền chỉnh sửa Playlist này.');
  }
  return await PlayList.findByIdAndUpdate(playlistId, updateData, { new: true });
};
const deletePlayList = async (playlistId, userID) => {
  const playlist = await PlayList.findById(playlistId);
  if (!playlist) throw new Error('Không tìm thấy Playlist.');
  if (playlist.createdBy.toString() !== userID.toString()) {
    throw new Error('Bạn không có quyền xóa Playlist này.');
  }
  return await PlayList.findByIdAndDelete(playlistId);
};
//cho trang kham pha
const getAllAlbums = async () => {
  return await PlayList.find({ type: 'album' });
};

const addSongToPlayList = async (playlistId, songId, userID) => {
  const playlist = await PlayList.findById(playlistId);
  if (!playlist) {
    throw new Error('Không tìm thấy Playlist!');
  }

  // Kiểm tra quyền sở hữu
  if (playlist.createdBy.toString() !== userID.toString()) {
    throw new Error('Bạn không có quyền thêm nhạc vào Playlist này.');
  }

  const song = await Song.findById(songId);
  if (!song) {
    throw new Error('Không tìm thấy bài hát!');
  }
  if (playlist.songs.includes(songId)) {
    throw new Error('Bài hát đã tồn tại trong Playlist.');
  }
  playlist.songs.push(songId);
  return await playlist.save();
};

const removeSongFromPlaylist = async (playlistId, songId, userID) => {
  const playlist = await PlayList.findById(playlistId);
  if (!playlist) {
    throw new Error('Không tìm thấy Playlist.');
  }

  // Kiểm tra quyền sở hữu
  if (playlist.createdBy.toString() !== userID.toString()) {
    throw new Error('Bạn không có quyền xóa nhạc khỏi Playlist này.');
  }

  playlist.songs.pull(songId);
  return await playlist.save();
};

const getUserPlaylist = async (userID) => {
  const playlists = await PlayList.find({ createdBy: userID, type: 'user-playlist' });
  return playlists;
};

const shuffleSongs = async (playlistId) => {
  const playlist = await PlayList.findById(playlistId).populate('songs');
  if (!playlist) {
    throw new Error('Không tìm thấy Playlist!');
  }

  // Fisher-Yates shuffle algorithm for better randomness
  const songs = [...playlist.songs];
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }
  return songs;
};

module.exports = {
  createUserPlaylist,
  createAlbum,
  createPopularToday,
  getPlayListByID,
  addSongToPlayList,
  removeSongFromPlaylist,
  getUserPlaylist,
  updatePlayList,
  deletePlayList,
  getAllAlbums,
  shuffleSongs
};
