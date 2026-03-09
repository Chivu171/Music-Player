const express = require('express');
const router = express.Router();
const artistController = require('./artist.controller');
const isAuthenticated = require('../../infrastructure/middleware/isAuthenticated');
const isAdmin = require('../../infrastructure/middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: API quản lý nghệ sĩ
 */

/**
 * @swagger
 * /api/artists/trending:
 *   get:
 *     summary: Lấy danh sách nghệ sĩ trending (tổng lượt nghe tuần cao nhất)
 *     tags: [Artists]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách nghệ sĩ trending
 */
router.get('/trending', artistController.getTrendingArtists);

/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Lấy danh sách tất cả nghệ sĩ
 *     tags: [Artists]
 *     responses:
 *       200:
 *         description: Danh sách nghệ sĩ
 */
router.get('/', artistController.getAllArtists);

/**
 * @swagger
 * /api/artists/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết nghệ sĩ
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết nghệ sĩ
 */
router.get('/:id', artistController.getArtistById);

/**
 * @swagger
 * /api/artists:
 *   post:
 *     summary: Tạo nghệ sĩ mới (Admin only)
 *     tags: [Artists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', isAuthenticated, isAdmin, artistController.createArtist);

/**
 * @swagger
 * /api/artists/{id}/follow:
 *   post:
 *     summary: Tăng lược theo dõi (follower) của nghệ sĩ
 *     tags: [Artists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tăng lượt theo dõi thành công
 */
router.post('/:id/follow', isAuthenticated, artistController.incrementFollower);

module.exports = router;
