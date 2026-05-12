const { Worker } = require("bullmq");

const {
  createBullMQConnection,
} = require("../config/bullmq");

const logger = require(
  "../config/logger"
);

const {
  getIO,
} = require("../config/socket");

const activityRepo = require(
  "../repositories/activity.repository"
);

const analyticsQueue = require(
  "../queues/analytics.queue"
);

const QUEUES = require(
  "../constants/queues"
);

const {
  emitSongLiked,
  emitSongPlayed,
  emitArtistUpload,
} = require(
  "../events/music.events"
);

const {
  emitFeedUpdate,
} = require(
  "../events/feed.events"
);

const worker = new Worker(
  QUEUES.ACTIVITY,

  async (job) => {
    const {
      user,
      songId,
      action,
      metadata,
    } = job.data || {};

    /* =====================================
       📝 CREATE ACTIVITY
    ===================================== */

    const activity =
      await activityRepo.createActivity(
        {
          user,
          songId,
          action,
          metadata,
        }
      );

    /* =====================================
       📊 ANALYTICS QUEUE
    ===================================== */

    await analyticsQueue
      .add("activity", {
        type: "activity",

        value: 1,

        meta: {
          user,
          songId,
          action,
        },
      })
      .catch((err) => {
        logger.warn({
          message:
            "Analytics queue enqueue failed",

          error:
            err.message,
        });
      });

    /* =====================================
       📡 SOCKET EVENTS
    ===================================== */

    const io = getIO();

    // 🚀 FEED UPDATE
    if (io) {
      emitFeedUpdate(
        io,
        user,
        {
          action,

          songId:
            activity.songId,

          title:
            metadata?.title ||
            "",
        }
      );
    }

    // ▶️ SONG PLAY EVENT
    if (
      io &&
      action === "play"
    ) {
      emitSongPlayed(
        io,
        {
          user,
          songId,
        }
      );
    }

    // ❤️ SONG LIKE EVENT
    if (
      io &&
      action === "like"
    ) {
      emitSongLiked(
        io,
        {
          user,
          songId,
        }
      );
    }

    // 🎤 ARTIST UPLOAD EVENT
    if (
      io &&
      action === "upload"
    ) {
      emitArtistUpload(
        io,
        {
          user,
          songId,
        }
      );
    }

    return {
      activityId:
        activity._id,
    };
  },

  {
    connection:
      createBullMQConnection(
        "activity-worker"
      ),

    concurrency: Number(
      process.env
        .ACTIVITY_WORKER_CONCURRENCY ||
        5
    ),
  }
);

/* =========================================
   ✅ JOB COMPLETED
========================================= */

worker.on(
  "completed",
  (job) => {
    logger.info({
      message:
        "Activity job completed",

      jobId:
        job.id,
    });
  }
);

/* =========================================
   ❌ JOB FAILED
========================================= */

worker.on(
  "failed",
  (job, err) => {
    logger.error({
      message:
        "Activity job failed",

      jobId:
        job?.id,

      error:
        err.message,
    });
  }
);

module.exports = worker;