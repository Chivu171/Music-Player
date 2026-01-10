const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')

const registerUser = async(userData) =>{
    const existingUser = await User.findOne({email:userData.email});
    if(existingUser){
        throw new Error('Email has been used!')
    }
    // 2. Mã hóa mật khẩu
    const hashedPW = await bcrypt.hash(userData.password,10)

    // 3. Tạo người dùng mới với mật khẩu đã được mã hóa
    const newUser = new User({
        username: userData.username,
        email:userData.email,
        password: hashedPW
    })
    //Luu nguoi dung moi vao
    const savedUser = await newUser.save();

     // 5. Trả về dữ liệu người dùng (không bao gồm mật khẩu)
     savedUser.password = undefined;
     return savedUser;

}
const loginUser  = async(loginData) =>{
    const user = await User.findOne({email: loginData.email});
    if (!user){
        throw new Error('Email or password is incorrect');
    }
    const isPasswordMatched = await bcrypt.compare (loginData.password,user.password)
    if (!isPasswordMatched){
        throw new Error('Email or password is incorrect')
    }
    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'} // Token hết hạn sau 1 giờ
    );
    user.password = undefined; // Bỏ mật khẩu khỏi đối tượng trả về
    return { user, token };
}

module.exports = {registerUser, loginUser,}