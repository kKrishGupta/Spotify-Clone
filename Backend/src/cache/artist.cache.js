const redis = require("../config/redis");

const ARTIST_TTL = 120;

const getArtistCache = async (key) => {
  await redis.connectRedis();
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setArtistCache = async (key, value) => {
  await redis.connectRedis();
  await redis.set(key, JSON.stringify(value), {
    EX: ARTIST_TTL,
  });
};

const invalidateArtistCache = async (key) => {
  await redis.connectRedis();
  return redis.del(key);
};

module.exports = {
  getArtistCache,
  setArtistCache,
  invalidateArtistCache,
};
