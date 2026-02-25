const express = require('express');
const router = express.Router();
const playListController = require('../controllers/PlayListController');
const isAuthenticated = require('../middleware/isAuthenticated');
const isAdmin = require('../middleware/isAdmin');

// Tất cả các route yêu cầu xác thực
router.use(isAuthenticated);

router.post('/create', playListController.createUserPlaylist);
router.get('/my-playlists', playListController.getUserPlaylists);
router.patch('/update/:id', playListController.updatePlayList);
router.delete('/delete/:id', playListController.deletePlayList);

router.post('/add-song', playListController.addSong);
router.post('/remove-song', playListController.removeSong);

router.get('/albums', playListController.getAllAlbums);
router.get('/:id', playListController.getById);

router.post('/admin/create-album', isAdmin, playListController.createAlbum);
router.post('/admin/trigger-popular', isAdmin, playListController.triggerPopularToday);

module.exports = router;