const redis = require("../config/redis");
const MUSIC_TTL = 120;

const getMusicCache = async(key) =>{
  await redis.connectRedis();
  const data = await redis.get(key);
  return data? JSON.parse(data) : null;
}

const setMusicCache = async (
  key,
  value
) => {
  await redis.connectRedis();
  await redis.set(
    key,
    JSON.stringify(value),
    {
      EX: MUSIC_TTL,
    }
  );
};

const invalidateMusicCache = async (key) => {
  await redis.connectRedis();
  return redis.del(key);
};

module.exports = {
  getMusicCache,
  setMusicCache,
  invalidateMusicCache,
};
