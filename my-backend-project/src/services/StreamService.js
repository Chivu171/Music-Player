
const Song = require('../models/SongModel');

const getSongPathById = async(songID)=>{
    const song = await Song.findById(songID);
    console.log('[Service] Kết quả tìm kiếm từ DB:', song); // <-- THÊM DÒNG NÀY

    if (!song) {
      throw new Error('Song not found');
      
    }
    return song.filePath;
}



  

  module.exports ={getSongPathById  };