const express = require('express');
const router = express.Router();
const artistController = require('../controllers/ArtistController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Artists
 *   description: API quản lý nghệ sĩ
 */

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

module.exports = router;

