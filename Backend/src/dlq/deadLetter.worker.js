const { Worker } =
  require("bullmq");

const {
  createBullMQConnection,
} = require(
  "../config/bullmq"
);

const logger =
  require(
    "../config/logger"
  );

const worker =
  new Worker(
    "dead-letter",

    async (job) => {

      logger.error({
        message:
          "Dead letter job captured",

        queue:
          job.data.queue,

        payload:
          job.data.payload,

        reason:
          job.data.reason,
      });

      return true;
    },

    {
      connection:
        createBullMQConnection(
          "dead-letter-worker"
        ),
    }
  );

module.exports =
  worker;