const notificationRepo =
  require(
    "../repositories/notification.repository"
  );

const notificationQueue =
  require(
    "../queues/notification.queue"
  );

const sendNotification =
  async ({
    user,
    message,
    metadata = {},
  }) => {

    await notificationQueue.add(
      "send-notification",
      {
        user,
        message,
        metadata,
      }
    );
  };

const getNotifications =
  async (userId) => {

    return await notificationRepo.getUserNotifications(
      userId
    );
  };

const readNotification =
  async (id) => {

    return await notificationRepo.markAsRead(
      id
    );
  };

const removeNotification =
  async (id) => {

    return await notificationRepo.deleteNotification(
      id
    );
  };

module.exports = {
  sendNotification,
  getNotifications,
  readNotification,
  removeNotification,
};