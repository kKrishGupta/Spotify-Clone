const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const playlistController = require("../controllers/playlist.controller");

router.post("/", protect, playlistController.createPlaylist);
router.put("/add", protect, playlistController.addSongToPlaylist);
router.get("/", protect, playlistController.getUserPlaylists);

module.exports = router;