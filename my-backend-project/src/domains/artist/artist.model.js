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
    imageUrl: { type: String, default: "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg" },
    followers: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
