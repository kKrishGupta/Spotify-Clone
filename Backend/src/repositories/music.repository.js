const musicModel = require("../models/music.model");

const getApprovedSongs = () => {
  return musicModel.find({ status: "approved" }).lean();
};

const getSongsByGenres = (genres) => {
  return musicModel.find({
    genre: { $in: genres },
    status: "approved"
  }).lean();
};

const incrementPlay = (id) => {
  return musicModel.findByIdAndUpdate(
    id,
    { $inc: { plays: 1 } },
    { new: true }
  );
};

module.exports = {
  getApprovedSongs,
  getSongsByGenres,
  incrementPlay
};