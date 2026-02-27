const express = require('express');
const router = express.Router();
const genreController = require('../controllers/GenreController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

/**
 * @swagger
 * tags:
 *   name: Genres
 *   description: API quản lý thể loại nhạc
 */

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Lấy danh sách tất cả thể loại
 *     tags: [Genres]
 *     responses:
 *       200:
 *         description: Danh sách thể loại
 */
router.get('/', genreController.getAllGenres);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết thể loại
 *     tags: [Genres]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết thể loại
 */
router.get('/:id', genreController.getGenreById);

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Tạo thể loại mới (Admin only)
 *     tags: [Genres]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', isAuthenticated, isAdmin, genreController.createGenre);

module.exports = router;

