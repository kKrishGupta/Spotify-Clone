const fs = require('fs/promises');
const path = require('path');

const logger = require('../config/logger');
const { scheduleJob } = require('../utils/scheduler');

const TEMP_DIR = path.join(
  __dirname,
  '../uploads/temp'
);

const LOGS_DIR = path.join(
  __dirname,
  '../logs'
);

const MAX_FILE_AGE = 24 * 60 * 60 * 1000; // 24 hours

const cleanupDirectory = async (dir) => {
  try {
    const files = await fs.readdir(dir);

    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(dir, file);

      const stats = await fs.stat(filePath);

      const fileAge =
        now - stats.mtimeMs;

      if (fileAge > MAX_FILE_AGE) {
        await fs.unlink(filePath);

        logger.info({
          message: 'Deleted old file',
          file: filePath,
        });
      }
    }
  } catch (err) {
    logger.error({
      message: 'Cleanup failed',
      error: err.message,
    });
  }
};

scheduleJob('0 * * * *', async () => {
  logger.info(
    'Running cleanup scheduler...'
  );

  await cleanupDirectory(TEMP_DIR);

  await cleanupDirectory(LOGS_DIR);
}, { name: 'cleanup' });

module.exports = {};
