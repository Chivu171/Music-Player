const express = require('express');
const router = express.Router();
const playListController = require('../controllers/PlayListController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

// Tất cả các route yêu cầu xác thực
router.use(isAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: API quản lý danh sách phát và Album
 */

/**
 * @swagger
 * /api/playlists/create:
 *   post:
 *     summary: Tạo playlist cá nhân mới
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo playlist thành công
 */
router.post('/create', playListController.createUserPlaylist);

/**
 * @swagger
 * /api/playlists/my-playlists:
 *   get:
 *     summary: Lấy tất cả playlist của người dùng hiện tại
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách playlist cá nhân
 */
router.get('/my-playlists', playListController.getUserPlaylists);

/**
 * @swagger
 * /api/playlists/update/{id}:
 *   patch:
 *     summary: Cập nhật thông tin playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch('/update/:id', playListController.updatePlayList);

/**
 * @swagger
 * /api/playlists/delete/{id}:
 *   delete:
 *     summary: Xóa playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/delete/:id', playListController.deletePlayList);

/**
 * @swagger
 * /api/playlists/add-song:
 *   post:
 *     summary: Thêm bài hát vào playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playListId:
 *                 type: string
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thêm bài hát thành công
 */
router.post('/add-song', playListController.addSong);

/**
 * @swagger
 * /api/playlists/remove-song:
 *   post:
 *     summary: Xóa bài hát khỏi playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playListId:
 *                 type: string
 *               songId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xóa bài hát thành công
 */
router.post('/remove-song', playListController.removeSong);

/**
 * @swagger
 * /api/playlists/albums:
 *   get:
 *     summary: Lấy tất cả Album
 *     tags: [Playlists]
 *     responses:
 *       200:
 *         description: Danh sách album
 */
router.get('/albums', playListController.getAllAlbums);

/**
 * @swagger
 * /api/playlists/shuffle/{id}:
 *   get:
 *     summary: Ngẫu hứng bài hát trong playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về danh sách bài hát đã shuffle
 */
router.get('/shuffle/:id', playListController.shuffle);

/**
 * @swagger
 * /api/playlists/{id}:
 *   get:
 *     summary: Lấy chi tiết playlist/album theo ID
 *     tags: [Playlists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết playlist
 */
router.get('/:id', playListController.getById);

/**
 * @swagger
 * /api/playlists/admin/create-album:
 *   post:
 *     summary: Tạo Album mới (Admin only)
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo album thành công
 */
router.post('/admin/create-album', isAdmin, playListController.createAlbum);

/**
 * @swagger
 * /api/playlists/admin/trigger-popular:
 *   post:
 *     summary: Cập nhật playlist phổ biến trong ngày (Admin only)
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.post('/admin/trigger-popular', isAdmin, playListController.triggerPopularToday);

module.exports = router;