const { Worker } =
  require("bullmq");

const {
  createBullMQConnection,
} = require(
  "../config/bullmq"
);

const notificationRepo =
  require(
    "../repositories/notification.repository"
  );

const {
  getIO,
} = require(
  "../config/socket"
);

const {
  emitNotification,
} = require(
  "../events/notification.events"
);

const logger =
  require(
    "../config/logger"
  );

const QUEUES =
  require(
    "../constants/queues"
  );

const worker =
  new Worker(
    QUEUES.NOTIFICATIONS,

    async (job) => {

      const {
        user,
        type = "system",
        title = "Notification",
        message,
        metadata = {},
        priority = "normal",
      } = job.data;

      const notification =
        await notificationRepo
          .createNotification({
            user,
            type,
            message,
            metadata: {
              title,
              priority,
              ...metadata,
            },
          });

      const io =
        getIO();

      if (io) {

        emitNotification(
          io,
          user,
          notification
        );
      }

      logger.info({
        message:
          "Notification delivered",

        user,
        type,
      });

      return notification;
    },

    {
      connection:
        createBullMQConnection(
          "notification-worker"
        ),

      concurrency:
      Number(
        process.env
          .NOTIFICATION_WORKER_CONCURRENCY || 1
      )
    }
  );

module.exports =
  worker;