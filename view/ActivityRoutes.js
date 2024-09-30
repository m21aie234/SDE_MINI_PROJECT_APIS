// routes/ActivityRoutes.js
const express = require('express');
const { 
    createActivity, 
    getUserActivities,
    getActivityStats
} = require('../controllers/ActivityController');
const protect = require('../middleware/AuthMiddleware');
const router = express.Router();

router.post('/create', protect, createActivity);
router.get('/', protect, getUserActivities);
router.get('/stats', getActivityStats);
  

module.exports = router;
