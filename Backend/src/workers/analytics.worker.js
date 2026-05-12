const { Worker } =
  require("bullmq");

const {
  createBullMQConnection,
} = require(
  "../config/bullmq"
);

const logger =
  require("../config/logger");

const analyticsRepo =
  require(
    "../repositories/analytics.repository"
  );

const {
  updateTrendingScore,
} = require(
  "../service/trending.service"
);

const {
  updateUserEmbedding,
} = require(
  "../ai/embedding.service"
);

const QUEUES =
  require(
    "../constants/queues"
  );

const worker =
  new Worker(
    QUEUES.ANALYTICS,

    async (job) => {

      const payload =
        job.data || {};

      // 🚀 SAVE EVENT
      const analytics =
        await analyticsRepo.create(
          payload
        );

      // 🚀 TRENDING UPDATE
      if (
        payload.songId
      ) {

        await updateTrendingScore(
          payload.songId,
          payload.type
        );
      }

      // 🚀 AI SIGNAL
      if (
        payload.user
      ) {

        await updateUserEmbedding(
          payload.user,
          payload
        );
      }

      logger.info({
        message:
          "Analytics processed",

        type:
          payload.type,

        user:
          payload.user,
      });

      return analytics;
    },

    {
      connection:
        createBullMQConnection(
          "analytics-worker"
        ),

      concurrency:
        Number(
          process.env
            .ANALYTICS_WORKER_CONCURRENCY ||
            5
        ),
    }
  );

module.exports =
  worker;