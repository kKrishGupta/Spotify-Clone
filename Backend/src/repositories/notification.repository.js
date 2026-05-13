const Notification = require("../models/notification.model");
const mongoose = require("mongoose");
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
        user:
          new mongoose.Types.ObjectId(
            userId
          ),
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

// 🚀 NEW
const getUnreadCount =
  async (userId) => {

    return await Notification.countDocuments({
      user:
        new mongoose.Types.ObjectId(
          userId
        ),

      read: false,
    });
  };

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  getUnreadCount,
};