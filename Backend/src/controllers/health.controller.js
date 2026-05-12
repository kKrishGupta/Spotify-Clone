const mongoose =
  require("mongoose");

const redis =
  require("../config/redis");

const {
  checkFFmpeg,
} = require(
  "../streaming/streaming.health"
);

const healthCheck =
  async (req, res) => {

    const mongo =
      mongoose.connection
        .readyState === 1;

    const redisOk =
      redis.client.isOpen;

    const ffmpeg =
      await checkFFmpeg();

    const healthy =
      mongo &&
      redisOk &&
      ffmpeg.healthy;

    return res
      .status(
        healthy
          ? 200
          : 503
      )
      .json({
        success:
          healthy,

        services: {
          mongo,
          redis:
            redisOk,
          ffmpeg,
        },

        uptime:
          process.uptime(),

        memory:
          process.memoryUsage(),

        timestamp:
          new Date(),
      });
  };

module.exports = {
  healthCheck,
};