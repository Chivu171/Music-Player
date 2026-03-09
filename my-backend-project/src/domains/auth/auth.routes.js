const express = require('express');
const router = express.Router();
const userController = require('./auth.controller');
const isAuthenticated = require('../../infrastructure/middleware/isAuthenticated');
const isAdmin = require('../../infrastructure/middleware/isAdmin')
const { uploadAvatar } = require('../../infrastructure/middleware/uploadMiddleware');



/**
 * @swagger
 * tags:
 *   name: User
 *   description: API quản lý người dùng và tài khoản
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về tokens
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Làm mới access token bằng refresh token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Trả về access token mới
 */
router.post('/refresh', userController.refreshToken);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về dữ liệu người dùng
 */
router.get('/me', isAuthenticated, userController.getMe);

/**
 * @swagger
 * /api/auth/upload-avatar:
 *   post:
 *     summary: Tải lên ảnh đại diện
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật ảnh đại diện thành công
 */
router.post('/upload-avatar', isAuthenticated, uploadAvatar.single('avatar'), userController.uploadAvatar);

/**
 * @swagger
 * /api/auth/updateProfile:
 *   post:
 *     summary: Cập nhật thông tin cá nhân
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.post('/updateProfile', isAuthenticated, userController.updateProfile);

/**
 * @swagger
 * /api/auth/changePassword:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 */
router.post('/changePassword', isAuthenticated, userController.changePassword);

/**
 * @swagger
 * /api/auth/like/{songId}:
 *   post:
 *     summary: Thích bài hát
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/like/:songId', isAuthenticated, userController.likeSong);

/**
 * @swagger
 * /api/auth/like/{songId}:
 *   delete:
 *     summary: Bỏ thích bài hát
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/like/:songId', isAuthenticated, userController.unlikeSong);

/**
 * @swagger
 * /api/auth/liked-songs:
 *   get:
 *     summary: Lấy danh sách bài hát đã thích
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.get('/liked-songs', isAuthenticated, userController.getLikedSongs);

/**
 * @swagger
 * /api/auth/history/{songId}:
 *   post:
 *     summary: Thêm bài hát vào lịch sử nghe
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: songId
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/history/:songId', isAuthenticated, userController.addToHistory);

/**
 * @swagger
 * /api/auth/history:
 *   get:
 *     summary: Lấy lịch sử nghe nhạc
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.get('/history', isAuthenticated, userController.getHistory);

/**
 * @swagger
 * /api/auth/follow/{artistId}:
 *   post:
 *     summary: Theo dõi nghệ sĩ
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 */
router.post('/follow/:artistId', isAuthenticated, userController.followArtist);

/**
 * @swagger
 * /api/auth/follow/{artistId}:
 *   delete:
 *     summary: Bỏ theo dõi nghệ sĩ
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: artistId
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/follow/:artistId', isAuthenticated, userController.unfollowArtist);

/**
 * @swagger
 * /api/auth/followed-artists:
 *   get:
 *     summary: Lấy danh sách nghệ sĩ đã theo dõi
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 */
router.get('/followed-artists', isAuthenticated, userController.getFollowedArtists);

module.exports = router;

