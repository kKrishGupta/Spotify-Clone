const asyncHandler = require("../utils/asyncHandler");
const musicModel = require("../models/music.model");
const activityModel = require("../models/activity.model");

const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 🔥 Trending (most played)
  const trending = await musicModel
    .find({ status: "approved" })
    .sort({ plays: -1 })
    .limit(10);

  // 🔥 New releases
  const newReleases = await musicModel
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(10);

  // 🔥 User activity (for personalization)
  const userActivities = await activityModel
    .find({ user: userId })
    .populate("song");

  // Extract genres safely
  const genres = userActivities
    .map((a) => a.song?.genre)
    .filter(Boolean);

  // ⚡ Remove duplicates (POWER MOVE)
  const uniqueGenres = [...new Set(genres)];

  // 🔥 Recommended songs
  const recommended = await musicModel
    .find({
      genre: { $in: uniqueGenres },
      status: "approved",
    })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      trending,
      newReleases,
      recommended,
    },
  });
});

module.exports = { getFeed };