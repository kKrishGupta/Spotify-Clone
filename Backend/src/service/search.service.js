const musicModel = require("../models/music.model");

const searchSongs = async(
  query,
  page = 1,
  limit = 10
) =>{
  const skip = (page-1)*limit;
  const songs = await musicModel.find(
    {
        $text: {
          $search: query,
        },

        status: "approved",
      },
      {
        score: {
          $meta: "textScore",
        },
      }
  ).sort({
    score:{
      $meta: "textScore",
    }
  }).skip(skip)
    .limit(limit);

  return songs;
}

module.exports = {
  searchSongs
}