const { Worker } = require("bullmq");
const { createBullMQConnection } = require("../config/bullmq");
const logger = require("../config/logger");
const { getPersonalizedFeed } = require("../service/recommendation.service");
const QUEUES = require("../constants/queues");

const worker = new Worker(
  QUEUES.RECOMMENDATIONS,
  async (job) => {
    const { userId } = job.data || {};

    if (!userId) {
      logger.warn({
        message: "Recommendation job skipped without userId",
        jobId: job.id,
      });
      return [];
    }

    const recommendations = await getPersonalizedFeed(userId);

    logger.info({
      message: "Recommendation job completed",
      jobId: job.id,
      userId,
      count: recommendations.length,
    });

    return recommendations;
  },
  {
    connection: createBullMQConnection("recommendation-worker"),
    concurrency: Number(process.env.RECOMMENDATION_WORKER_CONCURRENCY || 2),
  }
);

worker.on("failed", (job, err) => {
  logger.error({
    message: "Recommendation job failed",
    jobId: job?.id,
    error: err.message,
  });
});

module.exports = worker;
