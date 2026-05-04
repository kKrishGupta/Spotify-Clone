const asyncHandler = require("../utils/asyncHandler");
const activityModel = require("../models/activity.model");

// 🚀 NEW: use queue instead of direct DB writes
const activityQueue = require("../queues/activity.queue");

// 🎯 TRACK ACTIVITY (QUEUE BASED)
const trackActivity = asyncHandler(async (req, res) => {
  const { songId, action } = req.body;

  if (!songId || !action) {
    return res.status(400).json({
      message: "songId and action are required",
    });
  }

  // 🚀 Push to queue instead of DB
  await activityQueue.add("trackActivity", {
    user: req.user.id,
    song: songId,
    action,
  });

  res.status(202).json({
    message: "Activity queued successfully",
  });
});

// 👤 GET USER ACTIVITY (READ = DB)
const getUserActivity = asyncHandler(async (req, res) => {
  const activities = await activityModel
    .find({ user: req.user.id })
    .populate("song", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "User activities fetched successfully",
    activities: activities.map((activity) => ({
      id: activity._id,
      song: activity.song,
      action: activity.action,
      createdAt: activity.createdAt,
    })),
  });
});

// 🌍 GLOBAL FEED (READ = DB)
const getGlobalFeed = asyncHandler(async (req, res) => {
  const activities = await activityModel
    .find()
    .populate("user", "username")
    .populate("song", "title")
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    message: "Global feed fetched successfully",
    feed: activities.map((activity) => ({
      id: activity._id,
      user: activity.user,
      song: activity.song,
      action: activity.action,
      createdAt: activity.createdAt,
    })),
  });
});

module.exports = {
  trackActivity,
  getUserActivity,
  getGlobalFeed,
};