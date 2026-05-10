const logger = require("../utils/logger");

const retry = async(
  fn,
  retries = 3,
  delay = 1000,
)=>{
  let lastError;
   for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      logger.warn({
        retry: i + 1,
        error: err.message,
      });

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }

  throw lastError;
};

module.exports = retry;