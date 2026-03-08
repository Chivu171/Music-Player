const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - title
 *         - artist
 *         - fileUrl
 *         - duration
 *       properties:
 *         title:
 *           type: string
 *         artist:
 *           type: string
 *           description: Artist ID (ObjectId)
 *         genre:
 *           type: string
 *           description: Genre ID (ObjectId)
 *         fileUrl:
 *           type: string
 *         coverUrl:
 *           type: string
 *         cloudinaryId:
 *           type: string
 *         duration:
 *           type: number
 *         dailyListen:
 *           type: number
 *         totalListen:
 *           type: number
 */
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre' },
    fileUrl: { type: String, required: true },
    coverUrl: { type: String, default: 'https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-song.png' },
    cloudinaryId: { type: String, required: true },
    duration: { type: Number, required: true },
    dailyListen: { type: Number, default: 0 },
    weeklyListen: { type: Number, default: 0 },
    totalListen: { type: Number, default: 0 },
}, { timestamps: true })

const Song = mongoose.model('Song', songSchema)

module.exports = Song;