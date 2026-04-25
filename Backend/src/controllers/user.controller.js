const asyncHandler = require("../utils/asyncHandler");
const userModel = require("../models/user.model");

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
};