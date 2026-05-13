const IORedis =
  require("ioredis");

const logger =
  require("./logger");

const connections =
  new Map();

/* =========================================
   🚀 SHARED REDIS CONNECTION
========================================= */

const createBullMQConnection =
  (
    connectionName =
      "default"
  ) => {

    // ✅ REUSE EXISTING
    if (
      connections.has(
        connectionName
      )
    ) {
      return connections.get(
        connectionName
      );
    }

    const connection =
      new IORedis(
        process.env.REDIS_URL,
        {
          maxRetriesPerRequest:
            null,

          enableReadyCheck:
            false,

          lazyConnect: true,

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
                  "Retrying BullMQ Redis connection",

                connection:
                  connectionName,

                attempt:
                  times,
              });

              return delay;
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
            connectionName,
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
            connectionName,
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
            connectionName,

          error:
            err.message,
        });
      }
    );

    // ✅ SAVE CONNECTION
    connections.set(
      connectionName,
      connection
    );

    return connection;
  };

/* =========================================
   🚀 CLOSE ALL CONNECTIONS
========================================= */

const closeBullMQConnections =
  async () => {

    for (const connection of connections.values()) {

      try {

        await connection.quit();

      } catch (err) {

        logger.error({
          message:
            "Redis close failed",

          error:
            err.message,
        });
      }
    }

    connections.clear();
  };

module.exports = {
  createBullMQConnection,
  closeBullMQConnections,
};