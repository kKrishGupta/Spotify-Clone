const express = require('express');
const router = express.Router();

const {protect} = require('../middlewares/auth.middleware');
const {followUser, unfollowUser,getUserDashboard} = require('../controllers/user.controller');

// follow user
router.post('/follow/:id', protect, followUser);
// unfollow user
router.post('/unfollow/:id', protect, unfollowUser);

// get user dashboard
router.get("/me/dashboard", protect, getUserDashboard);
module.exports = router;
