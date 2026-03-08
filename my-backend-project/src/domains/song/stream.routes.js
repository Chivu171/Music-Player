const express = require('express');
const router = express.Router();
const streamController = require('./stream.controller');

/**
 * @swagger
 * tags:
 *   name: Streaming
 *   description: API hỗ trợ phát nhạc
 */

/**
 * @swagger
 * /api/stream/song/{id}:
 *   get:
 *     summary: Phát nhạc trực tiếp (Streaming) bài hát theo ID
 *     tags: [Streaming]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về luồng âm nhạc
 *       206:
 *         description: Trả về một phần âm nhạc (Partial Content)
 */
router.get('/song/:id', streamController.streamSong);


module.exports = router;