const redis = require(
  "../config/redis"
);

const logger = require(
  "../config/logger"
);

const cacheMiddleware =
  (
    keyBuilder,
    ttl = 60
  ) =>
  async (
    req,
    res,
    next
  ) => {

    const key =
      keyBuilder(req);

    /* =====================================
       🔥 CACHE READ
    ===================================== */

    try {

      const cached =
        await redis.get(
          key
        );

      if (cached) {

        return res.json(
          JSON.parse(
            cached
          )
        );
      }

    } catch (err) {

      logger.warn({
        message:
          "Cache read skipped",

        key,

        error:
          err.message,
      });
    }

    /* =====================================
       📤 ORIGINAL RESPONSE
    ===================================== */

    const sendResponse =
      res.json.bind(res);

    /* =====================================
       🚀 OVERRIDE RESPONSE
    ===================================== */

    res.json = (body) => {

      try {

        /* =================================
           ❌ DO NOT CACHE ERRORS
        ================================= */

        if (
          res.statusCode >=
          400
        ) {

          return sendResponse(
            body
          );
        }

        /* =================================
           📦 PAYLOAD SIZE CHECK
        ================================= */

        const serialized =
          JSON.stringify(
            body
          );

        const size =
          serialized.length;

        // ❌ Skip huge payloads (>1MB)
        if (
          size >
          1024 * 1024
        ) {

          logger.warn({
            message:
              "Cache skipped due to payload size",

            key,

            size,
          });

          return sendResponse(
            body
          );
        }

        /* =================================
           💾 CACHE RESPONSE
        ================================= */

        redis
          .set(
            key,
            serialized,
            {
              EX: ttl,
            }
          )

          .catch((err) => {

            logger.warn({
              message:
                "Cache write skipped",

              key,

              error:
                err.message,
            });
          });

      } catch (err) {

        logger.warn({
          message:
            "Cache middleware failed",

          key,

          error:
            err.message,
        });
      }

      return sendResponse(
        body
      );
    };

    return next();
  };

module.exports =
  cacheMiddleware;