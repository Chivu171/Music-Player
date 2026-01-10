const express = require('express');
const router  = express.Router();
const playListController = require('../controllers/PlayListController');
const isAuthenticated = require('../middleware/isAuthenticated');

// Tất cả các route trong file này đều yêu cầu đăng nhập

router.use(isAuthenticated);

router.post('/createplaylist', playListController.createPlayList);
router.get('/getplaylistbyid', playListController.getById)
router.post('/addSong',playListController.addSong)
router.post('/removeSong', playListController.removeSong)
router.get('/', playListController.getUserPlaylists); // << THÊM ROUTE MỚI NÀY

module.exports = router;