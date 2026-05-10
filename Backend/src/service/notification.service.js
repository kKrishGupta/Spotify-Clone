const notificationModel =
  require(
    "../models/notification.model"
  );

const createNotification =
  async ({
    user,
    message,
  }) => {
    return notificationModel.create(
      {
        user,
        message,
      }
    );
  };

const getNotifications =
  async (userId) => {
    return notificationModel
      .find({
        user: userId,
      })
      .sort({
        createdAt: -1,
      });
  };

module.exports = {
  createNotification,
  getNotifications,
};