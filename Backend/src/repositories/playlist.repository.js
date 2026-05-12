const Playlist = require("../models/playlist.model");

const create = async (data) => {
  return await Playlist.create(data);
};

const addSong = async (
  playlistId,
  songData
) => {

  return await Playlist.findByIdAndUpdate(
    playlistId,

    {
      $push: {
        songs: songData,
      },
    },

    {
      new: true,
    }
  );
};

const findByUser = async (
  userId
) => {
  return await Playlist.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

module.exports = {
  create,
  addSong,
  findByUser,
};
