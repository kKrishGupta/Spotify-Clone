const IORedis =
  require("ioredis");

const logger =
  require("./logger");

let sharedConnection = null;

/* =========================================
   🚀 SHARED REDIS CONNECTION
========================================= */

const createBullMQConnection =
  () => {

    if (
      sharedConnection
    ) {
      return sharedConnection;
    }

    sharedConnection =
      new IORedis(
        process.env.REDIS_URL,
        {
          maxRetriesPerRequest:
            null,

          enableReadyCheck:
            false,

          lazyConnect:
            true,

          connectTimeout:
            10000,

          retryStrategy:
            (times) => {

              const delay =
                Math.min(
                  times * 200,
                  3000
                );

              logger.warn({
                message:
                  "Retrying shared BullMQ Redis",

                attempt:
                  times,
              });

              return delay;
            },
        }
      );

    sharedConnection.on(
      "connect",
      () => {

        logger.info({
          message:
            "Shared BullMQ Redis connected",
        });
      }
    );

    sharedConnection.on(
      "ready",
      () => {

        logger.info({
          message:
            "Shared BullMQ Redis ready",
        });
      }
    );

    sharedConnection.on(
      "error",
      (err) => {

        logger.error({
          message:
            "Shared BullMQ Redis error",

          error:
            err.message,
        });
      }
    );

    return sharedConnection;
  };

/* =========================================
   🚀 CLOSE CONNECTION
========================================= */

const closeBullMQConnections =
  async () => {

    if (
      sharedConnection
    ) {

      try {

        await sharedConnection.quit();

      } catch (err) {

        logger.error({
          message:
            "BullMQ Redis close failed",

          error:
            err.message,
        });
      }

      sharedConnection =
        null;
    }
  };

module.exports = {
  createBullMQConnection,
  closeBullMQConnections,
};