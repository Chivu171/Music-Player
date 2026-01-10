const jwt  =require ('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const isAuthitencated = (req,res,next)=>{
    console.log('--- Đang kiểm tra xác thực ---'); // Log để xem middleware có được gọi không

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token,JWT_SECRET); // Giải mã token để lấy thông tin người dùng (id, username, role)
            req.user = decoded;    // Gắn thông tin người dùng vào đối tượng request để các hàm sau có thể dùng
            return next();
        }
        catch{
            return res.status(401).json({ message: 'Invalid token. Access denied' });
        }
    }
    if (!token){
        return res.status(401).json({ message: 'Không có token, truy cập bị từ chối' });
        }
}
module.exports = isAuthitencated
