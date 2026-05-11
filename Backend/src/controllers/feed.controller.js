const asyncHandler =
  require(
    "../utils/asyncHandler"
  );

const {
  getPersonalizedFeed,
} = require(
  "../service/recommendation.service"
);

const {
  getHybridSongs,
} = require(
  "../service/music.service"
);

const {
  getTrendingSongs,
} = require(
  "../service/trending.service"
);

const redis =
  require(
    "../config/redis"
  );

const logger =
  require(
    "../config/logger"
  );

// 🚀 SMART FEED ENGINE
const getFeed =
  asyncHandler(
    async (req, res) => {

      const userId =
        req.user?.id;

      if (!userId) {
        return res
          .status(401)
          .json({
            success:
              false,

            message:
              "Unauthorized",
          });
      }

      const cacheKey =
        `feed:${userId}`;

      // 🔥 CACHE
      try {
        const cached =
          await redis.get(
            cacheKey
          );

        if (cached) {
          return res
            .status(200)
            .json({
              success: true,

              source:
                "cache",

              data:
                JSON.parse(
                  cached
                ),
            });
        }
      } catch (err) {
        logger.warn({
          message:
            "Feed cache read failed",

          error:
            err.message,
        });
      }

      // 🚀 PERSONALIZED
      let personalized =
        [];

      try {
        personalized =
          await getPersonalizedFeed(
            userId
          );
      } catch (err) {
        logger.warn({
          message:
            "Personalized feed failed",

          error:
            err.message,
        });
      }

      // 🚀 TRENDING
      let trending =
        [];

      try {
        trending =
          await getTrendingSongs();
      } catch (err) {
        logger.warn({
          message:
            "Trending fetch failed",

          error:
            err.message,
        });
      }

      // 🚀 HYBRID FALLBACK
      let hybrid = [];

      try {
        hybrid =
          await getHybridSongs();
      } catch (err) {
        logger.warn({
          message:
            "Hybrid fetch failed",

          error:
            err.message,
        });
      }

      // 🚀 MERGE FEED
      const finalFeed =
        [
          ...personalized,
          ...trending,
          ...hybrid,
        ];

      // 🚀 REMOVE DUPLICATES
      const unique =
        [];

      const seen =
        new Set();

      for (const song of finalFeed) {

        const id =
          song.id ||
          song._id?.toString();

        if (
          !id ||
          seen.has(id)
        )
          continue;

        seen.add(id);

        unique.push(song);
      }

      // 🚀 LIMIT
      const result =
        unique.slice(0, 50);

      // 🚀 CACHE
      try {
        await redis.set(
          cacheKey,

          JSON.stringify(
            result
          ),

          {
            EX: 60,
          }
        );
      } catch (err) {
        logger.warn({
          message:
            "Feed cache write failed",

          error:
            err.message,
        });
      }

      return res
        .status(200)
        .json({
          success: true,

          source:
            "api",

          total:
            result.length,

          data:
            result,
        });
    }
  );

module.exports = {
  getFeed,
};