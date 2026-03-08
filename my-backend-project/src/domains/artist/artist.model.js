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
 */
const artistSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    bio: { type: String },
    imageUrl: { type: String, default: "https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-artist.png" },
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
