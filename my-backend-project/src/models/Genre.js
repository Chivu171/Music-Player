const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Genre:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         songs:
 *           type: array
 *           items:
 *             type: string
 *             description: Song ID (ObjectId)
 */
const genreSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

module.exports = mongoose.model('Genre', genreSchema);
