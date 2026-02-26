const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const isAuthenticated = require('../middleware/isAuthenticated'); // Import middleware



router.post('/register', userController.register);

router.get('/profile', isAuthenticated, (req, res) => {
    res.send(`Welcome User ID: ${req.user.id}`);
})
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);
router.get('/me', isAuthenticated, userController.getMe);
const { uploadAvatar } = require('../middleware/uploadMiddleware');


router.post('/upload-avatar', isAuthenticated, uploadAvatar.single('avatar'), userController.uploadAvatar);
router.post('/updateProfile', isAuthenticated, userController.updateProfile);
router.post('/changePassword', isAuthenticated, userController.changePassword);

router.post('/like/:songId', isAuthenticated, userController.likeSong);
router.delete('/like/:songId', isAuthenticated, userController.unlikeSong);
router.get('/liked-songs', isAuthenticated, userController.getLikedSongs);

router.post('/history/:songId', isAuthenticated, userController.addToHistory);
router.get('/history', isAuthenticated, userController.getHistory);

module.exports = router;
