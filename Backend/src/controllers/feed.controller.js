const asyncHandler = require("../utils/asyncHandler");
const { getPersonalizedFeed } = require("../service/recommendation.service");
const redis = require("../config/redis");
const { getHybridSongs } = require("../service/music.service");
const logger = require("../config/logger");

// 🎯 USER-AWARE + CACHED FEED
const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  // ✅ Auth safety
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - user not found",
    });
  }

  const cacheKey = `feed:${userId}`;

  // 🔥 1. Try cache first
  let cachedData = null;

  try {
    await redis.connectRedis();
    cachedData = await redis.get(cacheKey);
  } catch (err) {
    logger.warn({
      message: "Feed cache read skipped",
      error: err.message,
    });
  }

  if (cachedData) {
    return res.status(200).json({
      success: true,
      data: JSON.parse(cachedData),
      source: "cache", // optional (debugging)
    });
  }

  // 🔥 2. Generate personalized feed
  const data = await getPersonalizedFeed(userId);

  if (!data.length) {
  const hybrid = await getHybridSongs();
  return res.json({ success: true, data: hybrid });
}

  // 🔥 3. Store in Redis (TTL: 60 seconds)
  try {
    await redis.connectRedis();
    await redis.set(cacheKey, JSON.stringify(data), {
      EX: 60,
    });
  } catch (err) {
    logger.warn({
      message: "Feed cache write skipped",
      error: err.message,
    });
  }

  res.status(200).json({
    success: true,
    data,
    source: "api", // optional (debugging)
  });
});

module.exports = { getFeed };
