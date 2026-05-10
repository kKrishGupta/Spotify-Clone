const { Worker } = require("bullmq");
const { createBullMQConnection } = require("../config/bullmq");
const logger = require("../config/logger");
const { getIO } = require("../config/socket");
const notificationService = require("../service/notification.service");
const { emitNotification } = require("../events/notification.events");
const QUEUES = require("../constants/queues");

const worker = new Worker(
  QUEUES.NOTIFICATIONS,
  async (job) => {
    const notification = await notificationService.createNotification(job.data);
    const io = getIO();

    if (io && job.data?.user) {
      emitNotification(io, job.data.user.toString(), notification);
    }

    return notification;
  },
  {
    connection: createBullMQConnection("notification-worker"),
    concurrency: Number(process.env.NOTIFICATION_WORKER_CONCURRENCY || 5),
  }
);

worker.on("failed", (job, err) => {
  logger.error({
    message: "Notification job failed",
    jobId: job?.id,
    error: err.message,
  });
});

module.exports = worker;
