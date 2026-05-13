const activityWorker =
  require("./activity.worker");

const analyticsWorker =
  require("./analytics.worker");

const audioWorker =
  require("./audio.worker");

const notificationWorker =
  require("./notification.worker");

const recommendationWorker =
  require("./recommendation.worker");

const shutdown =
  async () => {

    try {

      await Promise.allSettled([
        activityWorker.close(),
        analyticsWorker.close(),
        audioWorker.close(),
        notificationWorker.close(),
        recommendationWorker.close(),
      ]);

      console.log(
        "✅ Workers closed"
      );

    } catch (err) {

      console.error(
        "❌ Worker shutdown failed",
        err.message
      );
    }

    process.exit(0);
  };

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);