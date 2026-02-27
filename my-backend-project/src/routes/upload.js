const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Artist = require("../models/Artist");
const Genre = require("../models/Genre");
const isAdmin = require('../middleware/isAdmin');
const isAuthenticated = require('../middleware/isAuthenticated');
const fs = require("fs");
const router = express.Router();
const upload = multer({ dest: "uploads/" });
const Song = require("../models/SongModel");

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
router.post("/", isAuthenticated, isAdmin, upload.single("file"), async (req, res) => {
    // ... (existing implementation)

    console.log("File nhận được:", req.file);
    if (!req.file) {
        return res.status(400).json({ error: "Vui lòng chọn file nhạc!" });
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
        });
        // Lưu vào DB xong thì xóa file tạm
        fs.unlinkSync(req.file.path);

        const { title, artistId, genreId } = req.body;

        // Tạo bài hát mới (artist là ObjectId bắt buộc)
        const newSong = await Song.create({
            title: title || req.file.originalname,
            artist: artistId,
            genre: genreId,
            fileUrl: result.secure_url,
            cloudinaryId: result.public_id,
            duration: result.duration
        });

        // Đồng bộ xuôi: Thêm bài hát vào mảng songs của Artist và Genre
        if (artistId) {
            await Artist.findByIdAndUpdate(artistId, { $push: { songs: newSong._id } });
        }
        if (genreId) {
            await Genre.findByIdAndUpdate(genreId, { $push: { songs: newSong._id } });
        }

        res.status(201).json(newSong);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;