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

const redis = require("../config/redis");

// 🔐 HASH OTP
const hashOtp = (otp) =>
  crypto.createHash("sha256").update(otp).digest("hex");

// ================= REGISTER =================

const registerUser =
  asyncHandler(
    async (req, res) => {

      const {
        username,
        email,
        password,
        role = "user",
      } = req.body;

      // ✅ VALIDATION
      if (
        !username ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All fields are required",
        });
      }

      // ✅ CHECK EXISTING USER
      const existingUser =
        await userModel.findOne({
          $or: [
            { username },
            {
              email:
                email.toLowerCase(),
            },
          ],
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "User already exists",
        });
      }

      // 🔐 HASH PASSWORD
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // 🔐 GENERATE OTP
      const otp =
        crypto
          .randomInt(
            100000,
            999999
          )
          .toString();

      const hashedOtp =
        hashOtp(otp);

      // 🚀 TEMP USER DATA
      const tempUser = {
        username,

        email:
          email.toLowerCase(),

        password:
          hashedPassword,

        role,

        emailOtp:
          hashedOtp,

        createdAt:
          Date.now(),
      };

      // 🚀 STORE TEMP USER
      await redis.client.set(

        `verify:${email.toLowerCase()}`,

        JSON.stringify(
          tempUser
        ),

        {
          EX: 600,
        }
      );

      // 📧 SEND OTP
      await sendVerificationEmail(
        email,
        otp
      );

      return res.status(200).json({
        success: true,

        message:
          "OTP sent to email",
      });
    }
  );

// ================= VERIFY EMAIL =================
const verifyEmail =
  asyncHandler(
    async (req, res) => {

      const {
        email,
        otp,
      } = req.body;

      // 🚀 GET TEMP USER
      const tempData =
        await redis.client.get(
          `verify:${email.toLowerCase()}`
        );

      if (!tempData) {

        return res.status(400).json({
          success: false,

          message:
            "OTP expired or registration not found",
        });
      }

      const parsed =
        JSON.parse(
          tempData
        );

      // 🔐 VERIFY OTP
      const hashedOtp =
        hashOtp(
          otp
            .replace(/\s/g, "")
            .trim()
        )

      if (
        parsed.emailOtp !==
        hashedOtp
      ) {

        return res.status(400).json({
          success: false,

          message:
            "Invalid OTP",
        });
      }

      // ✅ FINAL DUPLICATE CHECK
      const existingUser =
        await userModel.findOne({
          $or: [
            {
              username:
                parsed.username,
            },
            {
              email:
                parsed.email,
            },
          ],
        });

      if (existingUser) {

        return res.status(409).json({
          success: false,

          message:
            "User already exists",
        });
      }

      // 🚀 CREATE REAL USER
      const user =
        await userModel.create({

          username:
            parsed.username,

          email:
            parsed.email,

          password:
            parsed.password,

          role:
            parsed.role,

          isVerified:
            true,
        });

      // 🧹 REMOVE TEMP DATA
      await redis.client.del(
        `verify:${email.toLowerCase()}`
      );

      return res.status(201).json({
        success: true,

        message:
          "Email verified successfully",

        user: {
          id:
            user._id,

          username:
            user.username,

          email:
            user.email,
        },
      });
    }
  );

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

  const hashedOtp = hashOtp(
  otp
    .replace(/\s/g, "")
    .trim()
);

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
const resendOtp =
  asyncHandler(
    async (req, res) => {

      const {
        email,
      } = req.body;

      if (!email) {

        return res.status(400).json({

          success: false,

          message:
            "Email is required",
        });
      }

      // ✅ GET TEMP USER
      const tempData =
        await redis.client.get(
          `verify:${email.toLowerCase()}`
        );

      // ❌ SESSION EXPIRED
      if (!tempData) {

        return res.status(400).json({

          success: false,

          message:
            "Registration session expired. Please register again.",
        });
      }

      const parsed =
        JSON.parse(
          tempData
        );

      // ✅ GENERATE NEW OTP
      const otp =
        crypto
          .randomInt(
            100000,
            999999
          )
          .toString();

      const hashedOtp =
        hashOtp(otp);

      // ✅ UPDATE OTP
      parsed.emailOtp =
        hashedOtp;

      // ✅ RESET TIMER
      parsed.createdAt =
        Date.now();

      // ✅ SAVE AGAIN
      await redis.client.set(

        `verify:${email.toLowerCase()}`,

        JSON.stringify(
          parsed
        ),

        {
          EX: 600,
        }
      );

      // ✅ SEND EMAIL
      await sendVerificationEmail(
        email,
        otp
      );

      return res.status(200).json({

        success: true,

        message:
          "OTP resent successfully",
      });
    }
  );



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

const forgotPassword =
  asyncHandler(
    async (req, res) => {

      const {
        email,
      } = req.body;

      const user =
        await userModel.findOne({

          email:
            email.toLowerCase(),
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      const otp =
        crypto
          .randomInt(
            100000,
            999999
          )
          .toString();

      const hashedOtp =
        hashOtp(otp);

      user.resetPasswordOtp =
        hashedOtp;

      user.resetPasswordOtpExpires =
        Date.now() +
        10 * 60 * 1000;

      await user.save();

      await sendVerificationEmail(
        email,
        otp
      );

      res.json({

        success: true,

        message:
          "Password reset OTP sent",
      });
    }
  );

  const verifyResetOtp =
  asyncHandler(
    async (req, res) => {

      const {
        email,
        otp,
      } = req.body;

      const user =
        await userModel.findOne({

          email:
            email.toLowerCase(),
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      if (
        !user.resetPasswordOtp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "No reset OTP found",
        });
      }

      if (
        user.resetPasswordOtpExpires <
        Date.now()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "OTP expired",
        });
      }

      const hashedOtp =
        hashOtp(

          otp
            .replace(/\s/g, "")
            .trim()
        );

      if (
        hashedOtp !==
        user.resetPasswordOtp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP",
        });
      }

      res.json({

        success: true,

        message:
          "OTP verified",
      });
    }
  );

 const resetPassword =
  asyncHandler(
    async (req, res) => {

      const {
        email,
        password,
      } = req.body;

      const user =
        await userModel.findOne({

          email:
            email.toLowerCase(),
        });

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      user.resetPasswordOtp =
        null;

      user.resetPasswordOtpExpires =
        null;

      await user.save();

      res.json({

        success: true,

        message:
          "Password reset successful",
      });
    }
  );

// ================= EXPORT =================
module.exports = {
  registerUser,
  verifyEmail,
  verifyResetOtp,
  loginUser,
  sendLoginOtp,
  loginWithOtp,
  resendOtp,
  getCurrentUser,
  logoutUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};