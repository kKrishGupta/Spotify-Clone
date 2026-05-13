const musicModel =
  require(
    "../models/music.model"
  );

/* =========================================
   🚀 GET RECENT FEED
========================================= */

const getRecentFeed =
  async (
    limit = 50
  ) => {

    return musicModel

      .find({
        status:
          "approved",
      })

      .sort({
        createdAt:
          -1,
      })

      .limit(limit)

      .lean();
  };

module.exports = {
  getRecentFeed,
};