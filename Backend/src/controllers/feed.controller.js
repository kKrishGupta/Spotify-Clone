const asyncHandler = require("../utils/asyncHandler");
const { getPersonalizedFeed } = require("../service/recommendation.service");
const redis = require("../config/redis");
const { getHybridSongs } = require("../service/music.service");

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
  const cachedData = await redis.get(cacheKey);

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
  await redis.set(cacheKey, JSON.stringify(data), {
    EX: 60,
  });

  res.status(200).json({
    success: true,
    data,
    source: "api", // optional (debugging)
  });
});

module.exports = { getFeed };