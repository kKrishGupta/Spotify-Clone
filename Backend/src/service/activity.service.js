const activityRepo = require("../repositories/activity.repository");
const activityQueue = require("../queues/activity.queue");

// 🎯 TRACK ACTIVITY (QUEUE)
const trackActivity = async (userId, songId, action) => {
  try {
    await activityQueue.add("trackActivity", {
      user: userId,
      song: songId,
      action,
    });

    return { queued: true };
  } catch (err) {
    await activityRepo.createActivity({
      user: userId,
      song: songId,
      action,
    });

    return { queued: false };
  }
};

// 👤 GET USER ACTIVITY
const getUserActivity = async (userId) => {
  const activities = await activityRepo.findByUser(userId);

  return activities.map((activity) => ({
    id: activity._id,
    song: activity.song,
    action: activity.action,
    createdAt: activity.createdAt,
  }));
};

// 🌍 GLOBAL FEED
const getGlobalFeed = async () => {
  const activities = await activityRepo.findGlobal();

  return activities.map((activity) => ({
    id: activity._id,
    user: activity.user,
    song: activity.song,
    action: activity.action,
    createdAt: activity.createdAt,
  }));
};

module.exports = {
  trackActivity,
  getUserActivity,
  getGlobalFeed,
};
