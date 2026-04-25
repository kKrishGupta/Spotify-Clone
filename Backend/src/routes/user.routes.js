const express = require('express');
const router = express.Router();

const {protect} = require('../middlewares/auth.middleware');
const {followUser, unfollowUser} = require('../controllers/user.controller');

// follow user
router.post('/follow/:id', protect, followUser);
// unfollow user
router.post('/unfollow/:id', protect, unfollowUser);

module.exports = router;
