const express = require('express');
const router = express.Router();
const songController = require('./song.controller');
const isAuthenticated = require('../../infrastructure/middleware/isAuthenticated');
const isAdmin = require('../../infrastructure/middleware/isAdmin');


/**
 * @swagger
 * tags:
 *   name: Songs
 *   description: API quản lý bài hát
 */

/**
 * @swagger
 * /api/songs/getsongs:
 *   get:
 *     summary: Lấy danh sách tất cả các bài hát
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng bài hát mỗi trang (mặc định 10)
 *     responses:
 *       200:
 *         description: Danh sách bài hát thành công
 */
router.get('/getsongs', songController.getAllSongs);

/**
 * @swagger
 * /api/songs/search:
 *   get:
 *     summary: Tìm kiếm bài hát theo tiêu đề hoặc nghệ sĩ
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get('/search', songController.searchSongs);

/**
 * @swagger
 * /api/songs/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết bài hát theo ID
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài hát
 *     responses:
 *       200:
 *         description: Dữ liệu bài hát chi tiết
 */
router.get('/:id', songController.getDetailSongs);

/**
 * @swagger
 * /api/songs/listen/{id}:
 *   post:
 *     summary: Tăng lượt nghe của bài hát
 *     tags: [Songs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tăng lượt nghe thành công
 */
router.post('/listen/:id', songController.incrementListenCount);

/**
 * @swagger
 * /api/songs/popular:
 *   get:
 *     summary: Lấy danh sách bài hát phổ biến nhất
 *     tags: [Songs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách bài hát phổ biến
 */
router.get('/popular', songController.getPopularSongs);

/**
 * @swagger
 * /api/songs/{id}:
 *   delete:
 *     summary: Xóa bài hát (Admin only)
 *     tags: [Songs]
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
 *         description: Xóa bài hát thành công
 */
router.delete('/:id', isAuthenticated, isAdmin, songController.deleteSong);

module.exports = router;

