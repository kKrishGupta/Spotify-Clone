const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
router.post('/register' , authController.registerUser);
router.post('/login' , authController.loginUser);
router.post('/logout', authController.logoutUser);
router.get("/me", protect, authController.getCurrentUser);

module.exports = router;