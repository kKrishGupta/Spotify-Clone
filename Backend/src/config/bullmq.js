const IORedis = require("ioredis");
const logger = require("./logger");

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const connections = new Set();

const createBullMQConnection = (name = "bullmq") => {
  const connection = new IORedis(REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    enableOfflineQueue: process.env.BULLMQ_ENABLE_OFFLINE_QUEUE === "true",
    connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 5000),
    retryStrategy: (times) => {
      if (times > 5) {
        return null;
      }

      return Math.min(times * 500, 3000);
    },
    tls: REDIS_URL.startsWith("rediss://")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  connection.on("error", (err) => {
    logger.error({
      message: "BullMQ Redis connection error",
      connection: name,
      error: err.message,
    });
  });

  connection.on("connect", () => {
    logger.info({
      message: "BullMQ Redis connected",
      connection: name,
    });
  });

  connections.add(connection);
  return connection;
};

const closeBullMQConnections = async () => {
  await Promise.allSettled(
    [...connections].map(async (connection) => {
      if (connection.status === "wait") {
        connection.disconnect();
        return;
      }

      if (connection.status !== "end") {
        await connection.quit();
      }
    })
  );
};

module.exports = {
  createBullMQConnection,
  closeBullMQConnections,
};
