const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Dùng memoryStorage để tránh lưu file tạm vào ổ cứng
const storage = multer.memoryStorage();
const uploadAvatar = multer({ storage: storage });
const uploadAlbumCover = multer({ storage: storage });

module.exports = { uploadAvatar, uploadAlbumCover, cloudinary };
