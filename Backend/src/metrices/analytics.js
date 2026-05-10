const logger = require(
  "../config/logger"
);

const generateAnalytics =
  async () => {
    logger.info(
      "Analytics job started"
    );

    return true;
  };

module.exports = {
  generateAnalytics,
};