const { Worker } = require("bullmq");
const { createBullMQConnection } = require("../config/bullmq");
const logger = require("../config/logger");
const analyticsRepo = require("../repositories/analytics.repository");
const QUEUES = require("../constants/queues");

const worker = new Worker(
  QUEUES.ANALYTICS,
  async (job) => {
    const payload = job.data || {};

    await analyticsRepo.create({
      type: payload.type || job.name,
      value: payload.value || 1,
      meta: payload.meta || payload,
    });

    logger.info({
      message: "Analytics event recorded",
      jobId: job.id,
      type: payload.type || job.name,
    });
  },
  {
    connection: createBullMQConnection("analytics-worker"),
    concurrency: Number(process.env.ANALYTICS_WORKER_CONCURRENCY || 5),
  }
);

worker.on("failed", (job, err) => {
  logger.error({
    message: "Analytics job failed",
    jobId: job?.id,
    error: err.message,
  });
});

module.exports = worker;
