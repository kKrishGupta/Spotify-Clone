const asyncHandler = require("../utils/asyncHandler");
const activityModel = require("../models/activity.model");
const trackActivity = asyncHandler(async (req, res) => {
  const {songId, action} = req.body;
  const activity = await activityModel.create({
    user: req.user.id,
    song: songId,
    action
  });
  res.status(201).json({
    message: "Activity tracked successfully",
    activity:{
      id: activity._id,
      user: activity.user,
      song: activity.song,
      action: activity.action,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    }
  })
});

const getUserActivity = asyncHandler(async (req, res) => {
  const activities = await activityModel.find({user: req.user.id}).populate("song","title").sort({createdAt: -1});
  res.status(200).json({
    message: "User activities fetched successfully",  
    activities: activities.map(activity => ({
      id: activity._id,
      song: activity.song,  
      action: activity.action,
      createdAt: activity.createdAt,
    }))
  })
});

const getGlobalFeed = asyncHandler(async (req, res) => {
  const activities = await activityModel.find().populate("user", "username").populate("song", "title").sort({createdAt: -1}).limit(20);
  res.status(200).json({
    message: "Global feed fetched successfully",
    feed: activities.map(activity => ({
    id: activity._id,
    user: activity.user,
    song: activity.song,
    action: activity.action,
    createdAt: activity.createdAt,
    }))
  })
});

module.exports = {
  trackActivity,
  getUserActivity,
  getGlobalFeed
}