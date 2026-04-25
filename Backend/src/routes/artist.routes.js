const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/auth.middleware");
const artistController = require("../controllers/artist.controller");

router.get(
  "/dashboard",
  protect,
  authorize("artist"),
  artistController.getArtistDashboard
);

router.get(
  "/songs",
  protect,
  authorize("artist"),
  artistController.getArtistSongs
);

module.exports = router;