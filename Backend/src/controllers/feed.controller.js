const asyncHandler = require("../utils/asyncHandler");
const musicModel = require("../models/music.model");
const activityModel = require("../models/activity.model");
const { getHybridSongs } = require("../service/music.service");

const getFeed = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const trendingDB = await musicModel
    .find({ status: "approved" })
    .populate("artist", "username")
    .sort({ plays: -1 })
    .limit(10);

  const newReleasesDB = await musicModel
    .find({ status: "approved" })
    .populate("artist", "username")
    .sort({ createdAt: -1 })
    .limit(10);

  const userActivities = await activityModel
    .find({ user: userId })
    .populate("song");

  const genres = userActivities
    .map((a) => a.song?.genre)
    .filter(Boolean);

  const uniqueGenres = [...new Set(genres)];

  const recommendedDB = await musicModel
    .find({
      genre: { $in: uniqueGenres },
      status: "approved",
    })
    .populate("artist", "username")
    .limit(10);

  const apiSongs = await getHybridSongs();

  // 🔥 NORMALIZE FUNCTION (CRITICAL FIX)
  const formatSong = (song) => ({
    id: song._id,
    title: song.title,
    artist: song.artist?.username || "Unknown",
    cover: song.cover || "https://via.placeholder.com/150",
    uri: song.uri,
    plays: song.plays || 0,
    likes: song.likes || 0,
  });

  const formattedTrending = trendingDB.map(formatSong);
  const formattedRecommended = recommendedDB.map(formatSong);
  const formattedNew = newReleasesDB.map(formatSong);

  res.status(200).json({
    success: true,
    data: {
      hero:
        formattedTrending[0] ||
        apiSongs[0] ||
        null,

      trending:
        formattedTrending.length > 0
          ? formattedTrending
          : apiSongs,

      recommended:
        formattedRecommended.length > 0
          ? formattedRecommended
          : apiSongs,

      madeForYou:
        formattedNew.length > 0
          ? formattedNew
          : apiSongs,

      apiSongs,
    },
  });
});

module.exports = { getFeed };