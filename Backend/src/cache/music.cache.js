const redis = require("../config/redis");

const MUSIC_TTL = 120;

const getMusicCache =
  async (key) => {

    const data =
      await redis.get(key);

    return data
      ? JSON.parse(data)
      : null;
  };

const setMusicCache =
  async (key, value) => {

    await redis.set(
      key,

      JSON.stringify(value),

      {
        EX: MUSIC_TTL,
      }
    );
  };

const invalidateMusicCache =
  async (key) => {

    return redis.del(key);
  };

module.exports = {
  getMusicCache,
  setMusicCache,
  invalidateMusicCache,
};