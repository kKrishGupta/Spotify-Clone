const redis = require("../config/redis");

const SEARCH_TTL = 60;

const getSearchCache =
  async (key) => {

    const data =
      await redis.get(key);

    return data
      ? JSON.parse(data)
      : null;
  };

const setSearchCache =
  async (key, value) => {

    await redis.set(
      key,

      JSON.stringify(value),

      {
        EX: SEARCH_TTL,
      }
    );
  };

const invalidateSearchCache =
  async (key) => {

    return redis.del(key);
  };

module.exports = {
  getSearchCache,
  setSearchCache,
  invalidateSearchCache,
};