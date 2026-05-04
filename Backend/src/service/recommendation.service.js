const activityRepo = require("../repositories/activity.repository");
const musicRepo = require("../repositories/music.repository");
const musicModel = require("../models/music.model");
const userModel = require("../models/user.model");

// 🧹 Remove duplicates
const uniqueById = (songs) => {
  const seen = new Set();
  return songs.filter((song) => {
    const id = song?._id?.toString() || song?.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const getPersonalizedFeed = async (userId) => {
  // ✅ 1. Get user activity
  const activity = await activityRepo.getUserActivity(userId);

  const likedSongs = activity
    .filter((a) => a.action === "like")
    .map((a) => a.song);

  // ✅ 2. Get genres from liked songs
  let genres = [];

  if (likedSongs.length) {
    const likedMusic = await musicModel.find({
      _id: { $in: likedSongs },
    });

    genres = [...new Set(likedMusic.map((s) => s.genre))];
  }

  // 🎯 AI-based recommendations
  let recommendations = [];

  if (genres.length) {
    recommendations = await musicRepo.getSongsByGenres(genres);
  } else {
    // 🆕 Cold start fallback
    recommendations = await musicRepo.getApprovedSongs();
  }

  // 👥 3. SOCIAL FEED (NEW)
  const user = await userModel.findById(userId).lean();

  let socialSongs = [];

  if (user?.following?.length) {
    socialSongs = await musicModel
      .find({
        artist: { $in: user.following },
        status: "approved",
      })
      .sort({ createdAt: -1 })
      .limit(20);
  }

  // 🔥 4. MERGE SYSTEM (IMPORTANT)
  let finalFeed = [
    ...socialSongs,      // 🥇 Social first
    ...recommendations,  // 🥈 AI next
  ];

  // 🧹 Remove duplicates
  finalFeed = uniqueById(finalFeed);

  // 🎯 Limit response
  return finalFeed.slice(0, 50);
};

module.exports = { getPersonalizedFeed };