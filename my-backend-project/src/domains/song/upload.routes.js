const express = require("express");
const multer = require("multer");
const cloudinary = require("../../infrastructure/config/cloudinary");
const Artist = require("../artist/artist.model");
const Genre = require("../genre/genre.model");
const isAdmin = require('../../infrastructure/middleware/isAdmin');
const isAuthenticated = require('../../infrastructure/middleware/isAuthenticated');
const fs = require("fs");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const Song = require("./song.model");

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API tải nhạc lên hệ thống
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Tải bài hát mới lên Cloudinary và lưu vào DB (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File nhạc cần upload
 *               cover:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh bìa bài hát (tùy chọn)
 *               title:
 *                 type: string
 *               artistId:
 *                 type: string
 *               genreId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tải lên và lưu bài hát thành công
 */
router.post("/", isAuthenticated, isAdmin, upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
]), async (req, res) => {
    const songFile = req.files['file'] ? req.files['file'][0] : null;
    const coverFile = req.files['cover'] ? req.files['cover'][0] : null;

    if (!songFile) {
        return res.status(400).json({ error: "Vui lòng chọn file nhạc!" });
    }
    try {
        // Upload audio file
        const audioResult = await cloudinary.uploader.upload(songFile.path, {
            resource_type: "auto",
        });
        fs.unlinkSync(songFile.path);

        // Upload cover image (if provided)
        let coverUrl = 'https://res.cloudinary.com/dywwla9mp/image/upload/v1/default-song.png';
        if (coverFile) {
            const coverResult = await cloudinary.uploader.upload(coverFile.path, {
                resource_type: "image",
            });
            coverUrl = coverResult.secure_url;
            fs.unlinkSync(coverFile.path);
        }

        const { title, artistId, genreId } = req.body;

        const newSong = await Song.create({
            title: title || songFile.originalname,
            artist: artistId,
            genre: genreId,
            fileUrl: audioResult.secure_url,
            coverUrl: coverUrl,
            cloudinaryId: audioResult.public_id,
            duration: audioResult.duration
        });

        res.status(201).json(newSong);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;