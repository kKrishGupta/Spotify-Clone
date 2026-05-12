const redis =
  require("../config/redis");

const musicModel =
  require(
    "../models/music.model"
  );

const SCORE_MAP = {
  play: 1,

  like: 3,

  share: 5,

  playlist_add: 4,
};

// 🚀 UPDATE SCORE
const updateTrendingScore =
  async (
    songId,
    type
  ) => {

    const score =
      SCORE_MAP[type] || 1;

    await redis.zIncrBy(
      "trending:songs",
      score,
      songId
    );
  };

// 🚀 GET TRENDING
const getTrendingSongs =
  async (
    limit = 20
  ) => {

    const ids =
      await redis.zRange(
        "trending:songs",
        0,
        limit - 1,
        {
          REV: true,
        }
      );

    if (!ids.length)
      return [];

    return await musicModel.find({
      _id: {
        $in: ids.filter(
          (id) =>
            !id.startsWith(
              "yt-"
            )
        ),
      },
    });
  };

module.exports = {
  getTrendingSongs,
  updateTrendingScore,
};