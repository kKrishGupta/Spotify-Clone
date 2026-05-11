const redis = require("redis");
const logger = require("./logger");

const REDIS_URL =
  process.env.REDIS_URL;

const client = redis.createClient({
  url: REDIS_URL,

  socket: {
    reconnectStrategy: (retries) => {
      logger.warn({
        message:
          "Retrying Redis connection",
        retries,
      });

      return Math.min(
        retries * 500,
        3000
      );
    },

    connectTimeout: 20000,
  },
});

client.on("error", (err) => {
  logger.error({
    message: "Redis client error",
    error: err.message,
  });
});

client.on("connect", () => {
  logger.info(
    "Connecting to Redis"
  );
});

client.on("ready", () => {
  logger.info("Redis ready");
});

const connectRedis =
  async () => {
    if (!client.isOpen) {
      await client.connect();
    }

    return client;
  };

module.exports = {
  client,
  connectRedis,
};