const redis = require("../config/redis");

const FEED_TTL = 60;

const getFeedCache =
  async (key) => {

    const data =
      await redis.get(key);

    return data
      ? JSON.parse(data)
      : null;
  };

const setFeedCache =
  async (key, value) => {

    await redis.set(
      key,

      JSON.stringify(value),

      {
        EX: FEED_TTL,
      }
    );
  };

const invalidateFeedCache =
  async (key) => {

    return redis.del(key);
  };

module.exports = {
  getFeedCache,
  setFeedCache,
  invalidateFeedCache,
};