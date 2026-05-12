const asyncHandler = require("../utils/asyncHandler");
const notificationService = require("../service/notification.service");

// 📥 GET USER NOTIFICATIONS
const getNotifications =
  asyncHandler(
    async (req, res) => {

      const notifications =
        await notificationService.getNotifications(
          req.user.id
        );

      res.status(200).json({
        success: true,
        notifications,
      });
    }
  );

// ✅ MARK READ
const markAsRead =
  asyncHandler(
    async (req, res) => {

      const notification =
        await notificationService.readNotification(
          req.params.id
        );

      res.status(200).json({
        success: true,
        notification,
      });
    }
  );

// ❌ DELETE
const deleteNotification =
  asyncHandler(
    async (req, res) => {

      await notificationService.removeNotification(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Notification deleted",
      });
    }
  );

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
};