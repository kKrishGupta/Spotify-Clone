const notificationRepo =
  require(
    "../repositories/notification.repository"
  );

const notificationQueue =
  require(
    "../queues/notification.queue"
  );

const userModel =
  require(
    "../models/user.model"
  );

const {
  getIO,
} = require(
  "../config/socket"
);

/* =========================================
   🚀 SEND SINGLE NOTIFICATION
========================================= */

const sendNotification =
  async ({
    user,
    type = "system",
    title = "Notification",
    message,
    metadata = {},
    priority = "normal",
  }) => {

    // ❌ VALIDATION
    if (
      !user ||
      !message
    ) {
      console.log(
        "Missing notification fields"
      );

      return null;
    }

    try {

      /* =====================================
         💾 SAVE DIRECTLY TO DATABASE
      ===================================== */

      const notification =
        await notificationRepo.createNotification(
          {
            user,
            type,
            title,
            message,
            metadata,
          }
        );

      console.log(
        "Notification saved:",
        notification._id
      );

      /* =====================================
         🚀 OPTIONAL QUEUE
      ===================================== */

      try {

        await notificationQueue.add(
          "send-notification",

          {
            notificationId:
              notification._id,

            user,

            type,

            title,

            message,

            metadata,

            priority,
          }
        );

      } catch (queueErr) {

        console.log(
          "Notification queue failed:",
          queueErr.message
        );
      }

      /* =====================================
         📡 REALTIME SOCKET
      ===================================== */

      try {

        const io =
          getIO();

        if (io) {

          // ✅ NEW ROOM
          io.to(
            user.toString()
          ).emit(
            "notification:new",
            notification
          );

          // ✅ OLD ROOM SUPPORT
          io.to(
            `user:${user}`
          ).emit(
            "notification:new",
            notification
          );
        }

      } catch (socketErr) {

        console.log(
          "Socket emit failed:",
          socketErr.message
        );
      }

      return notification;

    } catch (err) {

      console.log(
        "Notification save failed:",
        err.message
      );

      return null;
    }
  };

/* =========================================
   🚀 BROADCAST NOTIFICATION
========================================= */

/* =========================================
   🚀 BROADCAST NOTIFICATION
========================================= */

const broadcastNotification =
  async ({
    users = [],
    type = "broadcast",
    title,
    message,
    metadata = {},
    priority = "normal",
  }) => {

    // ❌ EMPTY USERS
    if (!users.length) {
      return [];
    }

    // ✅ SAVE FOR EVERY USER
    const notifications =
      await Promise.all(

        users.map(
          async (
            userId
          ) => {

            return await sendNotification(
              {
                user:
                  userId,

                type,

                title,

                message,

                metadata,

                priority,
              }
            );
          }
        )
      );

    return notifications;
  };

/* =========================================
   🚀 SEND TO PLAN USERS
========================================= */

const notifyPlanUsers =
  async ({
    plan,
    title,
    message,
    metadata = {},
  }) => {

    const users =
      await userModel
        .find({
          subscriptionPlan:
            plan,
        })
        .select("_id");

    return await Promise.all(

      users.map(
        async (u) => {

          return await sendNotification(
            {
              user:
                u._id,

              type:
                "system",

              title,

              message,

              metadata,
            }
          );
        }
      )
    );
  };

/* =========================================
   🚀 GET USER NOTIFICATIONS
========================================= */

const getNotifications =
  async (
    userId
  ) => {

    return await notificationRepo
      .getUserNotifications(
        userId
      );
  };

/* =========================================
   🚀 MARK READ
========================================= */

const readNotification =
  async (id) => {

    return await notificationRepo
      .markAsRead(id);
  };

/* =========================================
   🚀 DELETE
========================================= */

const removeNotification =
  async (id) => {

    return await notificationRepo
      .deleteNotification(id);
  };

/* =========================================
   🚀 GET UNREAD COUNT
========================================= */

const getUnreadCount =
  async (
    userId
  ) => {

    return await notificationRepo
      .getUnreadCount(
        userId
      );
  };

module.exports = {
  sendNotification,
  broadcastNotification,
  notifyPlanUsers,
  getNotifications,
  readNotification,
  removeNotification,
  getUnreadCount,
};