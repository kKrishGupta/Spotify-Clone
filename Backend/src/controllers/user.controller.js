const asyncHandler = require("../utils/asyncHandler");
const userModel = require("../models/user.model");
const musicModel = require("../models/music.model");
const activityModel = require("../models/activity.model");

const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    // 🔥 stats
    const totalPlays = await musicModel.aggregate([
      { $group: { _id: null, total: { $sum: "$plays" } } },
    ]);

    const likedSongs = await activityModel.countDocuments({
      user: userId,
      action: "like",
    });

    // 🔥 recent activity
    const recent = await activityModel
      .find({ user: userId })
      .populate("song")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        username: user.username,
        stats: [
          { label: "Plays", value: totalPlays[0]?.total || 0 },
          { label: "Likes", value: likedSongs || 0 },
          { label: "Following", value: user.following?.length || 0 },
          { label: "Followers", value: user.followers?.length || 0 },
        ],

        recent: recent.map((a) => ({
          id: a._id,
          title: a.song?.title,
          artist: a.song?.artist,
          cover: a.song?.cover,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard failed" });
  }
};

// follow user
const followUser = asyncHandler(async (req, res) => {
    const targetUserId = req.params.id;
  const currentUserId = req.user.id;

  // ❌ Prevent self-follow
  if (targetUserId === currentUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  // ✅ Check if target exists
  const targetUser = await userModel.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🔥 Atomic updates (no duplicates)
  await Promise.all([
    userModel.findByIdAndUpdate(currentUserId, {
      $addToSet: { following: targetUserId },
    }),
    userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { followers: currentUserId },
    }),
  ]);

  res.status(200).json({
    success: true,
    message: "User followed successfully",
  });
});

// unfollow user
const unfollowUser = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user.id;
  await userModel.findByIdAndUpdate(currentUserId, {
    $pull: { following: targetUserId },
  });
  await userModel.findByIdAndUpdate(targetUserId, {
    $pull: { followers: currentUserId },
  });
  res.status(200).json({
    success: true,
    message: "User unfollowed successfully",
  });
});

module.exports = {
  followUser,
  unfollowUser,
  getUserDashboard,
};
