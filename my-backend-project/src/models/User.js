const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, default: "" }, // Tên hiển thị
    avatar: { type: String, default: "https://link-anh-mac-dinh.png" },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    likedSongs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    listenHistory: [{
        song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
        listenedAt: { type: Date, default: Date.now }
    }],
    refreshTokens: [String]
}, { timestamps: true }) // timestamps tự động thêm createdAt và updatedAt

const User = mongoose.model('User', userSchema)
module.exports = User
