// routes/UserRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/UserController');
const protect = require('../middleware/AuthMiddleware');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
