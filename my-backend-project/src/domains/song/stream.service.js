const Song = require('./song.model');

const getSongPathById = async (songID) => {
  const song = await Song.findById(songID);
  console.log('[Service] Kết quả tìm kiếm từ DB:', song); // <-- THÊM DÒNG NÀY

  if (!song) {
    throw new Error('Song not found');

  }
  return song.fileUrl;
}





module.exports = { getSongPathById };