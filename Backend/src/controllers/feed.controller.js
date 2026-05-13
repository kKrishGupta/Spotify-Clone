const asyncHandler =
  require(
    "../utils/asyncHandler"
  );

const redis =
  require(
    "../config/redis"
  );

const logger =
  require(
    "../config/logger"
  );

const {
  buildFeed,
} = require(
  "../service/feed.service"
);

/* =========================================
   🚀 SMART FEED CONTROLLER
========================================= */

const getFeed =
  asyncHandler(
    async (req, res) => {

      const userId =
        req.user?.id;

      /* =====================================
         🔐 AUTH CHECK
      ===================================== */

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

      /* =====================================
         🔥 CACHE READ
      ===================================== */

      try {
        const cached =
          await redis.client.get(
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

      /* =====================================
         🚀 BUILD FEED
      ===================================== */

      let result = [];

      try {
        result =
          await buildFeed(
            userId
          );
      } catch (err) {
        logger.error({
          message:
            "Feed build failed",

          error:
            err.message,
        });

        return res
          .status(500)
          .json({
            success:
              false,

            message:
              "Failed to build feed",
          });
      }

      /* =====================================
         🔥 CACHE WRITE
      ===================================== */

      try {
        await redis.client.set(
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

      /* =====================================
         ✅ RESPONSE
      ===================================== */

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