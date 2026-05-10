const redis = require("../config/redis");
const logger = require("../config/logger");

const cacheMiddleware =
  (keyBuilder, ttl = 60) =>
  async (req, res, next) => {
    const key = keyBuilder(req);

    try {
      await redis.connectRedis();
      const cached = await redis.get(key);

      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (err) {
      logger.warn({
        message: "Cache read skipped",
        key,
        error: err.message,
      });
    }

    const sendResponse = res.json.bind(res);

    res.json = (body) => {
      redis
        .connectRedis()
        .then(() =>
          redis.set(key, JSON.stringify(body), {
            EX: ttl,
          })
        )
        .catch((err) => {
          logger.warn({
            message: "Cache write skipped",
            key,
            error: err.message,
          });
        });

      return sendResponse(body);
    };

    return next();
  };

module.exports = cacheMiddleware;
