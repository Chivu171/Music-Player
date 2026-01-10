const express = require('express');
const router  = express.Router();
const userController = require('../controllers/UserController');
const isAuthenticated = require('../middleware/isAuthenticated'); // Import middleware



// GET /api/songs
router.post('/register', userController.register);

router.get('/profile', isAuthenticated, (req,res)=>{
    res.send(`Welcome User ID: ${req.user.id}`);
})
router.post('/login',userController.login);



module.exports = router;
