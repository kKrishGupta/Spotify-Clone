const IORedis =
  require("ioredis");

const logger =
  require("./logger");

const REDIS_URL =
  process.env.REDIS_URL;

const connections =
  new Set();

const createBullMQConnection =
  (
    name = "bullmq"
  ) => {
    const connection =
      new IORedis(
        REDIS_URL,
        {
          lazyConnect: true,

          maxRetriesPerRequest:
            null,

          enableReadyCheck:
            true,

          enableOfflineQueue:
            true,

          connectTimeout:
            20000,

          retryStrategy: (
            times
          ) => {
            logger.warn({
              message:
                "Retrying BullMQ Redis connection",

              connection:
                name,

              attempt:
                times,
            });

            return Math.min(
              times * 1000,
              5000
            );
          },
        }
      );

    connection.on(
      "connect",
      () => {
        logger.info({
          message:
            "BullMQ Redis connected",

          connection:
            name,
        });
      }
    );

    connection.on(
      "ready",
      () => {
        logger.info({
          message:
            "BullMQ Redis ready",

          connection:
            name,
        });
      }
    );

    connection.on(
      "error",
      (err) => {
        logger.error({
          message:
            "BullMQ Redis error",

          connection:
            name,

          error:
            err.message,
        });
      }
    );

    connections.add(
      connection
    );

    return connection;
  };

module.exports = {
  createBullMQConnection,
};