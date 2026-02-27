const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email has been used!')
    }
    const hashedPW = await bcrypt.hash(userData.password, 10)

    const newUser = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPW
    })
    //Luu nguoi dung moi vao
    const savedUser = await newUser.save();

    savedUser.password = undefined;
    return savedUser;

}
const loginUser = async (loginData) => {
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
        throw new Error('Email or password is incorrect');
    }
    const isPasswordMatched = await bcrypt.compare(loginData.password, user.password)
    if (!isPasswordMatched) {
        throw new Error('Email or password is incorrect')
    }

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Access token ngắn (15 phút)
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Refresh token dài (7 ngày)
    );

    // Lưu refresh token vào DB
    user.refreshTokens.push(refreshToken);
    await user.save();

    user.password = undefined;
    return { user, accessToken, refreshToken };
}

const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            throw new Error('Invalid refresh token');
        }

        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        return newAccessToken;
    } catch (error) {
        throw new Error('Refresh token expired or invalid');
    }
}
const getMe = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    if (user.role === 'admin') {
        user.likedSongs = undefined;
    }
    return user;

}
const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error('Old password is incorrect');
    }
    // Ma hoa mk moi
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);
    //Cap nhat mk moi
    user.password = hashedNewPassword;
    await user.save();
    return { message: 'Password changed successfully' };
}
const updateProfile = async (userId, updateData) => {
    // Chỉ lấy những trường cho phép cập nhật
    const { fullName, avatar, bio } = updateData;

    const user = await User.findByIdAndUpdate(
        userId,
        { fullName, avatar, bio },
        { new: true, runValidators: true } // Trả về user mới sau khi update
    ).select('-password');

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};
const likeSong = async (userId, songId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.likedSongs.includes(songId)) {
        throw new Error('Song already liked');
    }

    user.likedSongs.push(songId);
    await user.save();
    return user;
};

const unlikeSong = async (userId, songId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
    await user.save();
    return user;
};

const getLikedSongs = async (userId) => {
    const user = await User.findById(userId).populate('likedSongs');
    if (!user) throw new Error('User not found');
    return user.likedSongs;
};

const addToHistory = async (userId, songId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Giữ lại 50 bài hát gần nhất trong lịch sử
    user.listenHistory.unshift({ song: songId, listenedAt: new Date() });
    if (user.listenHistory.length > 50) {
        user.listenHistory.pop();
    }

    await user.save();
    return user;
};

const getHistory = async (userId) => {
    const user = await User.findById(userId).populate('listenHistory.song');
    if (!user) throw new Error('User not found');
    return user.listenHistory;
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    changePassword,
    updateProfile,
    likeSong,
    unlikeSong,
    getLikedSongs,
    addToHistory,
    getHistory,
    refreshAccessToken
};