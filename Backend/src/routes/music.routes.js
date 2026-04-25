const express = require("express");
const router = express.Router();

const musicController = require("../controllers/music.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const multer = require("multer");

// ✅ Memory storage (good for Cloudinary later)
const upload = multer({
  storage: multer.memoryStorage(),
});

// 🎵 Upload song (Artist only)
router.post(
  "/upload",
  protect,
  authorize("artist"),
  upload.single("music"),
  musicController.createMusic
);

// 📀 Create album (Artist only)
router.post(
  "/album",
  protect,
  authorize("artist"),
  musicController.createAlbum
);

// 🎧 Get all songs (All logged-in users)
router.get(
  "/",
  protect,
  musicController.getAllMusics
);

// 📀 Get all albums
router.get(
  "/album",
  protect,
  musicController.getAllAlbums
);

// 📀 Get album by ID
router.get(
  "/album/:albumId",
  protect,
  musicController.getAlbumById
);

module.exports = router;