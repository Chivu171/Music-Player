
const Song = require('../models/SongModel');

const getAllSong = async()=>{
    const songs = await Song.find();
    if (!songs ||songs.length ===0) {
      throw new Error('Song not found');

    }
    return songs;
}


  

  module.exports ={getAllSong  };