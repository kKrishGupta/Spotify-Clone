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
        message,
        metadata,
      } = job.data;

      // 💾 SAVE
      const notification =
        await notificationRepo.createNotification(
          {
            user,
            message,
            metadata,
          }
        );

      // ⚡ REALTIME EMIT
      const io = getIO();

      if (io) {

        emitNotification(
          io,
          user,
          notification
        );
      }

      return notification;
    },

    {
      connection:
        createBullMQConnection(
          "notification-worker"
        ),
    }
  );

module.exports =
  worker;