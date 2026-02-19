const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error('Email has been used!')
    }
    // 2. Mã hóa mật khẩu
    const hashedPW = await bcrypt.hash(userData.password, 10)

    // 3. Tạo người dùng mới với mật khẩu đã được mã hóa
    const newUser = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPW
    })
    //Luu nguoi dung moi vao
    const savedUser = await newUser.save();

    // 5. Trả về dữ liệu người dùng (không bao gồm mật khẩu)
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
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token hết hạn sau 1 giờ
    );
    user.password = undefined; // Bỏ mật khẩu khỏi đối tượng trả về
    return { user, token };
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
module.exports = { registerUser, loginUser, getMe, changePassword, updateProfile }