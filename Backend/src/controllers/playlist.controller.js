const asybcHandler = require("../utils/asyncHandler");
const Playlist = require("../models/playlist.model");

const createPlaylist = asybcHandler(async (req, res) => {
  const {name} = req.body;
  const playlist = await Playlist.create({
    name,
    user: req.user._id
  });
  res.status(201).json({
    success: true,
    playlist
  });
});

const addSongToPlaylist = asybcHandler(async (req, res) => {
  const {playlistId} = req.params;
  const {songId} = req.body;
  const playlist = await Playlist.findByIdAndUpdate(playlistId,
    {$addToSet: {songs: songId}},
    {new: true}
  );
  res.status(200).json({
    success: true,
    playlist
  });
});

const getUserPlaylists = asybcHandler(async (req, res) => {
  const playlists = await Playlist.find({user: req.user._id}).populate("songs");
  res.status(200).json({
    success: true,
    playlists
  });
});

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  getUserPlaylists
};
  