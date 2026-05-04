const activityModel = require("../models/activity.model");

const getUserActivity = (userId) => {
  return activityModel.find({ user: userId }).lean();
};

const createActivity = (data) => {
  return activityModel.create(data);
};

module.exports = {
  getUserActivity,
  createActivity
};