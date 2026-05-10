const logger = require("../config/logger");

let cron = null;

try {
  cron = require("node-cron");
} catch (err) {
  logger.warn({
    message: "node-cron is not installed; scheduler fallback is active",
  });
}

const fallbackIntervals = {
  "0 * * * *": 60 * 60 * 1000,
  "*/30 * * * *": 30 * 60 * 1000,
  "0 0 * * *": 24 * 60 * 60 * 1000,
};

const scheduleJob = (expression, task, options = {}) => {
  const name = options.name || expression;

  if (cron) {
    return cron.schedule(expression, task);
  }

  const intervalMs = fallbackIntervals[expression];
  if (!intervalMs) {
    logger.warn({
      message: "Scheduler skipped because no fallback interval exists",
      name,
      expression,
    });
    return null;
  }

  logger.warn({
    message: "Scheduler using interval fallback",
    name,
    expression,
  });

  return setInterval(task, intervalMs);
};

module.exports = {
  scheduleJob,
};
