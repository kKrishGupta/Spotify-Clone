const asyncHandler =
  require(
    "../utils/asyncHandler"
  );

const mongoose =
  require(
    "mongoose"
  );

const notificationService =
  require(
    "../service/notification.service"
  );

/* =========================================
   📥 GET USER NOTIFICATIONS
========================================= */

const getNotifications =
  asyncHandler(
    async (
      req,
      res
    ) => {

      // ✅ VALIDATE USER
      if (
        !req.user?.id
      ) {
        return res
          .status(401)
          .json({
            success: false,

            message:
              "Unauthorized",
          });
      }

      const userId =
        new mongoose.Types.ObjectId(
          req.user.id
        );

      // 📥 FETCH
      const notifications =
        await notificationService.getNotifications(
          userId
        );

      // 🔥 UNREAD COUNT
      const unreadCount =
        await notificationService.getUnreadCount(
          userId
        );

      res.status(200).json({
        success: true,

        total:
          notifications.length,

        unreadCount,

        notifications,
      });
    }
  );

/* =========================================
   ✅ MARK READ
========================================= */

const markAsRead =
  asyncHandler(
    async (
      req,
      res
    ) => {

      const notification =
        await notificationService.readNotification(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          success: false,

          message:
            "Notification not found",
        });
      }

      res.status(200).json({
        success: true,

        notification,
      });
    }
  );

/* =========================================
   ❌ DELETE NOTIFICATION
========================================= */

const deleteNotification =
  asyncHandler(
    async (
      req,
      res
    ) => {

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