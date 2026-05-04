const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
// 📝 REGISTER → sends OTP
router.post("/register", authController.registerUser);

// 🔐 VERIFY EMAIL (OTP)
router.post("/verify-email", authController.verifyEmail);

// 🔑 LOGIN WITH PASSWORD
router.post("/login", authController.loginUser);

// 🔢 LOGIN WITH OTP (step 1: send OTP)
router.post("/login-otp", authController.sendLoginOtp);

// 🔢 VERIFY LOGIN OTP (step 2)
router.post("/verify-login-otp", authController.loginWithOtp);

// 🔄 RESEND EMAIL OTP
router.post("/resend-otp", authController.resendOtp);

// 🔐 AUTH FEATURES (UNCHANGED)
router.post("/logout", authController.logoutUser);
router.get("/me", protect, authController.getCurrentUser);
router.post("/refresh", authController.refreshAccessToken);

module.exports = router;