const Playlist = require("../models/playlist.model");

const create = (data) => Playlist.create(data);

const addSong = (playlistId, songId) =>
  Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { songs: songId } },
    { new: true }
  );

const findByUser = (userId) =>
  Playlist.find({ user: userId }).populate("songs");

module.exports = {
  create,
  addSong,
  findByUser,
};
