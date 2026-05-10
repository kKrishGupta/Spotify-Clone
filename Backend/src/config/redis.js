const redis = require("redis");
const logger = require("./logger");

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const isTLS = REDIS_URL.startsWith("rediss://");

const client = redis.createClient({
  url: REDIS_URL,
  socket: {
    tls: isTLS,
    rejectUnauthorized: false,
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        logger.error({
          message: "Redis retry limit reached",
          retries,
        });
        return new Error("Retry limit reached");
      }

      return Math.min(retries * 500, 3000);
    },
  },
});

let connectingPromise = null;

const connectRedis = async () => {
  if (client.isOpen) {
    return client;
  }

  if (!connectingPromise) {
    connectingPromise = client.connect().catch((err) => {
      connectingPromise = null;
      logger.error({
        message: "Redis connection failed",
        error: err.message,
      });
      throw err;
    });
  }

  await connectingPromise;
  return client;
};

const disconnectRedis = async () => {
  if (client.isOpen) {
    await client.quit();
  }
};

client.on("error", (err) => {
  logger.error({
    message: "Redis client error",
    error: err.message,
  });
});

client.on("connect", () => {
  logger.info("Connecting to Redis");
});

client.on("ready", () => {
  logger.info("Redis ready");
});

client.connectRedis = connectRedis;
client.disconnectRedis = disconnectRedis;

module.exports = client;
