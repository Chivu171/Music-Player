const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    bio: { type: String },
    imageUrl: { type: String, default: "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png" },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
