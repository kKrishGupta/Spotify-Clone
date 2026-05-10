const asyncHandler = require("../utils/asyncHandler");

// 🔥 NEW ARCHITECTURE
const activityService = require("../service/activity.service");

// 🔥 RESPONSE HANDLER
const { success, error } = require("../utils/response");

// 🎯 TRACK ACTIVITY (QUEUE BASED)
const trackActivity = asyncHandler(async (req, res) => {
  const { songId, action } = req.body;

  if (!songId || !action) {
    return error(res, "songId and action required", 400);
  }

  await activityService.trackActivity(req.user.id, songId, action);

  return success(res, {}, "Activity queued", 202);
});

// 👤 GET USER ACTIVITY
const getUserActivity = asyncHandler(async (req, res) => {
  const data = await activityService.getUserActivity(req.user.id);

  return success(res, data, "User activities fetched successfully");
});

// 🌍 GLOBAL FEED
const getGlobalFeed = asyncHandler(async (req, res) => {
  const data = await activityService.getGlobalFeed();

  return success(res, data, "Global feed fetched successfully");
});

module.exports = {
  trackActivity,
  getUserActivity,
  getGlobalFeed,
};