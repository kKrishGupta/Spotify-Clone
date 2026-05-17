require("dotenv").config();

const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");
const {client: redis,connectRedis,disconnectRedis} = require("./src/config/redis");
const logger = require("./src/config/logger");
const { PORT } = require("./src/config/env");
const { initializeSocket } = require("./src/config/socket");
const { closeBullMQConnections } = require("./src/config/bullmq");

const backgroundModules = [];

const startBackgroundSystems = (queuePrerequisitesAvailable) => {
  if (queuePrerequisitesAvailable) {
    backgroundModules.push(
      require("./src/workers/activity.worker"),
      require("./src/workers/audio.worker"),
      require("./src/workers/analytics.worker"),
      require("./src/workers/notification.worker"),
      require("./src/workers/recommendation.worker")
    );
  } else {
    logger.warn("Queue workers skipped because Redis or MongoDB is unavailable");
  }

  backgroundModules.push(
    require("./src/schedulers/cleanup.scheduler"),
    require("./src/schedulers/trending.scheduler"),
    require("./src/schedulers/analytics.scheduler")
  );
};

const closeBackgroundSystems = async () => {
  await Promise.allSettled(
    backgroundModules
      .filter((moduleRef) => moduleRef && typeof moduleRef.close === "function")
      .map((moduleRef) => moduleRef.close())
  );

  await closeBullMQConnections();
};

const startServer = async () => {
  let server;

  try {
    logger.info("Starting server");

    let dbAvailable = false;

    try {
      await connectDB();
      dbAvailable = true;
      logger.info("MongoDB connected successfully");
    } catch (err) {
      logger.warn({
        message: "MongoDB unavailable during startup",
        error: err.message,
      });

      if (process.env.DB_REQUIRED === "true") {
        throw err;
      }
    }

    let redisAvailable = false;

    try {
      await connectRedis();
      redisAvailable = true;
      logger.info("Redis connected successfully");
    } catch (err) {
      logger.warn({
        message: "Redis unavailable during startup",
        error: err.message,
      });

      if (process.env.REDIS_REQUIRED === "true") {
        throw err;
      }
    }

    server = http.createServer(app);
    initializeSocket(server);
    startBackgroundSystems(redisAvailable && dbAvailable);

    server.listen(PORT, () => {
      logger.info({
  message:
    "Server running",

  port: PORT,

  env:
    process.env.NODE_ENV,

  render:
    !!process.env.RENDER,
});
    });

    const gracefulShutdown = async () => {
      logger.warn("Graceful shutdown initiated");

      if (server) {
        server.close(async () => {
          try {
            await closeBackgroundSystems();
            await disconnectRedis();
            logger.info("Server resources closed");
            process.exit(0);
          } catch (err) {
            logger.error({
              shutdownError: err.message,
            });
            process.exit(1);
          }
        });
      }
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (err) {
    logger.error({
      startupError: err.message,
      stack: err.stack,
    });

    process.exit(1);
  }
};

process.on("uncaughtException", (err) => {
  logger.error({
    type: "UNCAUGHT_EXCEPTION",
    message: err.message,
    stack: err.stack,
  });

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error({
    type: "UNHANDLED_REJECTION",
    reason,
  });

  process.exit(1);
});

startServer();
