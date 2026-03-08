const jwt = require('jsonwebtoken')
const User = require('../../domains/auth/auth.model')
const JWT_SECRET = process.env.JWT_SECRET

const isAuthitencated = async (req, res, next) => {
    console.log('--- Đang kiểm tra xác thực ---');

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            // Lấy user từ DB để đảm bảo có đầy đủ dữ liệu (bao gồm cả role)
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Không tìm thấy người dùng. Truy cập bị từ chối' });
            }

            req.user = user;
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
    }
}
module.exports = isAuthitencated
