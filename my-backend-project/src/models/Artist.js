const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Artist:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         imageUrl:
 *           type: string
 *         songs:
 *           type: array
 *           items:
 *             type: string
 *             description: Song ID (ObjectId)
 */
const artistSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    bio: { type: String },
    imageUrl: { type: String, default: "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png" },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
