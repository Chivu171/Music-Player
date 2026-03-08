const isAdmin = (req, res, next) => {
    // req.user được gán từ middleware isAuthenticated
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({
            message: 'Truy cập bị từ chối. Bạn không có quyền Admin để thực hiện hành động này.'
        });
    }
};

module.exports = isAdmin;
