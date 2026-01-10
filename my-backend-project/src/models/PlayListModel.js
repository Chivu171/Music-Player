const mongoose = require('mongoose');

const playListSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
      },
      songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song', // 'Song' là tên model bài hát
      }],

}, {timestamps:true});
const PlayList = mongoose.model('PlayList', playListSchema)


module.exports = PlayList