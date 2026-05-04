const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../utils/asyncHandler");
const crypto = require("crypto");

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = require("../config/env");

const {
  sendVerificationEmail,
  sendLoginOtpEmail,
} = require("../utils/email");

// 🔐 Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRES_IN || "7d" }
  );

  return { accessToken, refreshToken };
};

// 🔐 HASH OTP
const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// ================= REGISTER =================
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otp);

  const user = await userModel.create({
    username,
    email: email.toLowerCase(),
    password: hash,
    role,
    emailOtp: hashedOtp,
    emailOtpExpires: Date.now() + 10 * 60 * 1000,
    otpAttempts: 0,
    otpLastSentAt: Date.now(),
    isVerified: false,
  });

  await sendVerificationEmail(user.email, otp);

  res.status(201).json({
    message: "OTP sent to email. Verify to continue.",
  });
});

// ================= VERIFY EMAIL =================
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.emailOtp || !user.emailOtpExpires) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (user.emailOtpExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (user.otpAttempts >= 5) {
    return res.status(429).json({ message: "Too many attempts" });
  }

  const hashedOtp = hashOtp(otp.trim());

  if (user.emailOtp !== hashedOtp) {
    user.otpAttempts += 1;
    await user.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;
  user.otpAttempts = 0;

  await user.save();

  res.json({ message: "Email verified successfully" });
});

// ================= LOGIN PASSWORD =================
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    return res.status(400).json({
      message: "Username or email is required",
    });
  }

  const user = await userModel.findOne({
    $or: [
      ...(username ? [{ username }] : []),
      ...(email ? [{ email: email.toLowerCase() }] : []),
    ],
  });

  if (!user || !user.isVerified) {
    return res.status(401).json({
      message: "Invalid credentials or not verified",
    });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
    },
  });
});

// ================= SEND LOGIN OTP =================
const sendLoginOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user || !user.isVerified) {
    return res.status(400).json({ message: "User not found or not verified" });
  }

  // cooldown 60 sec
  if (user.otpLastSentAt && Date.now() - user.otpLastSentAt < 60000) {
    return res.status(429).json({ message: "Wait before requesting OTP" });
  }

  user.loginOtp = undefined;
  user.loginOtpExpires = undefined;

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otp);

  user.loginOtp = hashedOtp;
  user.loginOtpExpires = Date.now() + 10 * 60 * 1000;
  user.otpAttempts = 0;
  user.otpLastSentAt = Date.now();

  await user.save();

  await sendLoginOtpEmail(user.email, otp);

  res.json({ message: "Login OTP sent" });
});

// ================= VERIFY LOGIN OTP =================
const loginWithOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await userModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (!user.loginOtp || !user.loginOtpExpires) {
    return res.status(400).json({ message: "No OTP found" });
  }

  if (user.loginOtpExpires < Date.now()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (user.otpAttempts >= 5) {
    return res.status(429).json({ message: "Too many attempts" });
  }

  const hashedOtp = hashOtp(otp.trim());

  if (user.loginOtp !== hashedOtp) {
    user.otpAttempts += 1;
    await user.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.loginOtp = undefined;
  user.loginOtpExpires = undefined;
  user.otpAttempts = 0;

  await user.save();

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({
    message: "Login successful (OTP)",
    accessToken,
    refreshToken,
  });
});

// ================= RESEND OTP =================
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({
    email: email.toLowerCase(),
  });

  if (!user || user.isVerified) {
    return res.status(400).json({ message: "Invalid request" });
  }

  if (user.otpLastSentAt && Date.now() - user.otpLastSentAt < 60000) {
    return res.status(429).json({ message: "Wait before requesting again" });
  }

  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;

  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOtp = hashOtp(otp);

  user.emailOtp = hashedOtp;
  user.emailOtpExpires = Date.now() + 10 * 60 * 1000;
  user.otpAttempts = 0;
  user.otpLastSentAt = Date.now();

  await user.save();

  await sendVerificationEmail(user.email, otp);

  res.json({ message: "OTP resent successfully" });
});



// ================= LOGOUT =================
const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (userId) {
    await userModel.findByIdAndUpdate(userId, {
      $set: { refreshToken: null },
    });
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
});


// ================= REFRESH TOKEN =================
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const user = await userModel.findById(decoded.id);

  if (!user || user.refreshToken !== token) {
    return res.status(403).json({ message: "Token mismatch" });
  }

  const newAccessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({ message: "Access token refreshed" });
});


// ================= CURRENT USER =================
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user.id)
    .select("-password -refreshToken -emailOtp -loginOtp");

  res.json({ user });
});

// ================= EXPORT =================
module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  sendLoginOtp,
  loginWithOtp,
  resendOtp,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
};