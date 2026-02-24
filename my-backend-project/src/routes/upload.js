const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs"); // Nhớ require thêm thư viện fs của nodejs


const router = express.Router();
const upload = multer({ dest: "uploads/" });
const Song = require("../models/SongModel");
// cấu hình cloudinary từ ENV
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

router.post("/", upload.single("file"), async (req, res) => {
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
        const { title, artist } = req.body;
        const newSong = await Song.create({
            title: title || req.file.originalname, // Nếu ko nhập title thì lấy tên file gốc
            artist: artist || "Unknown Artist",
            fileUrl: result.secure_url,            // Link từ Cloudinary
            duration: result.duration              // Độ dài từ Cloudinary
        });
        res.status(201).json(newSong);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;