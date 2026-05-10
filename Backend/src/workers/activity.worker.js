const { Worker } = require("bullmq");
const { createBullMQConnection } = require("../config/bullmq");
const logger = require("../config/logger");
const { getIO } = require("../config/socket");
const activityRepo = require("../repositories/activity.repository");
const analyticsQueue = require("../queues/analytics.queue");
const QUEUES = require("../constants/queues");
const {
  emitSongLiked,
  emitSongPlayed,
} = require("../events/music.events");

const worker = new Worker(
  QUEUES.ACTIVITY,
  async (job) => {
    const { user, song, action, metadata } = job.data || {};

    const activity = await activityRepo.createActivity({
      user,
      song,
      action,
      metadata,
    });

    await analyticsQueue
      .add("activity", {
        type: "activity",
        value: 1,
        meta: {
          user,
          song,
          action,
        },
      })
      .catch((err) => {
        logger.warn({
          message: "Analytics queue enqueue failed",
          error: err.message,
        });
      });

    const io = getIO();
    if (io && action === "play") {
      emitSongPlayed(io, { user, song });
    }
    if (io && action === "like") {
      emitSongLiked(io, { user, song });
    }

    return {
      activityId: activity._id,
    };
  },
  {
    connection: createBullMQConnection("activity-worker"),
    concurrency: Number(process.env.ACTIVITY_WORKER_CONCURRENCY || 5),
  }
);

worker.on("completed", (job) => {
  logger.info({
    message: "Activity job completed",
    jobId: job.id,
  });
});

worker.on("failed", (job, err) => {
  logger.error({
    message: "Activity job failed",
    jobId: job?.id,
    error: err.message,
  });
});

module.exports = worker;
