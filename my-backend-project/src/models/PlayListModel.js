const mongoose = require('mongoose');

const playListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  thumbnail: { type: String, default: "default-playlist.png" }, // Ảnh bìa

  // Thuộc tính quan trọng nhất để phân loại
  type: {
    type: String,
    enum: ['album', 'user-playlist', 'popular-today', 'recommendation'],
    default: 'user-playlist'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artistName: { type: String },

  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song', // 'Song' là tên model bài hát
  }],
  isPublic: { type: Boolean, default: true }, // Playlist cá nhân có thể để private

}, { timestamps: true });
const PlayList = mongoose.model('PlayList', playListSchema)


module.exports = PlayList