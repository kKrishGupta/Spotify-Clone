const Notification =
  require("../models/notification.model");

const createNotification =
  async (data) => {

    return await Notification.create(
      data
    );
  };

const getUserNotifications =
  async (userId) => {

    return await Notification
      .find({
        user: userId,
      })
      .sort({
        createdAt: -1,
      });
  };

const markAsRead =
  async (id) => {

    return await Notification.findByIdAndUpdate(
      id,

      {
        read: true,
      },

      {
        new: true,
      }
    );
  };

const deleteNotification =
  async (id) => {

    return await Notification.findByIdAndDelete(
      id
    );
  };

module.exports = {
  createNotification,

  getUserNotifications,

  markAsRead,

  deleteNotification,
};