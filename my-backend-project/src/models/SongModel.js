const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    fileUrl: { type: String, required: true },
    duration: { type: Number, required: true },
})

const Song = mongoose.model('Song', songSchema)

module.exports = Song;