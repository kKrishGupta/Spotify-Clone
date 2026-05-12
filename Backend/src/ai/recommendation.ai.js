const musicModel =
  require(
    "../models/music.model"
  );

const {
  getVector,
} = require(
  "./vector.service"
);

const recommendSongs =
  async (
    userId
  ) => {

    const vector =
      await getVector(
        "user",
        userId
      );

    // 🚀 COLD START
    if (!vector) {

      return await musicModel
        .find({
          status:
            "approved",
        })
        .sort({
          plays: -1,
        })
        .limit(20);
    }

    const genres =
      Object.entries(
        vector.genres ||
        {}
      )
        .sort(
          (
            a,
            b
          ) =>
            b[1] - a[1]
        )
        .slice(0, 5)
        .map(
          (
            item
          ) => item[0]
        );

    const songs =
      await musicModel.find(
        {
          genre: {
            $in:
              genres,
          },

          status:
            "approved",
        }
      );

    // 🚀 SCORE
    const ranked =
      songs.sort(
        (
          a,
          b
        ) => {

          const scoreA =
            a.plays +
            a.likes * 3;

          const scoreB =
            b.plays +
            b.likes * 3;

          return (
            scoreB -
            scoreA
          );
        }
      );

    return ranked.slice(
      0,
      20
    );
  };

module.exports = {
  recommendSongs,
};