const musicModel = require(
  "../models/music.model"
);

const getTrendingSongs = async () => {
  return await musicModel
    .find({
      status: "approved",
    })
    .sort({
      plays: -1,
      likes: -1,
    })
    .limit(20);
};

module.exports = {
  getTrendingSongs,
};