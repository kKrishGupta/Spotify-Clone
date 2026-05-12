const activityModel =
  require("../models/activity.model");

// 👤 USER ACTIVITY
const findByUser =
  async (userId) => {

    return await activityModel
      .find({
        user: userId,
      })
      .sort({
        createdAt: -1,
      });
  };

// 🌍 GLOBAL FEED
const findGlobal =
  async () => {

    return await activityModel
      .find()
      .populate(
        "user",
        "username avatar"
      )
      .sort({
        createdAt: -1,
      })
      .limit(20);
  };

// 🆕 CREATE
const createActivity =
  async (data) => {

    return await activityModel.create(
      data
    );
  };

module.exports = {
  findByUser,
  findGlobal,
  createActivity,
};