const logger = require('../config/logger');
const { scheduleJob } = require('../utils/scheduler');

const User = require('../models/user.model');
const Song = require('../models/music.model');

scheduleJob('0 0 * * *', async () => {
  try {
    logger.info(
      'Running analytics aggregation...'
    );

    const totalUsers =
      await User.countDocuments();

    const totalSongs =
      await Song.countDocuments();

    // Example DAU placeholder
    const dau = Math.floor(
      totalUsers * 0.35
    );

    // Example MAU placeholder
    const mau = Math.floor(
      totalUsers * 0.7
    );

    logger.info({
      message:
        'Analytics aggregation completed',
      analytics: {
        totalUsers,
        totalSongs,
        dau,
        mau,
      },
    });

    // TODO:
    // store analytics snapshots
    // send dashboards
    // AI reporting
    // growth prediction
  } catch (err) {
    logger.error({
      message:
        'Analytics scheduler failed',
      error: err.message,
    });
  }
}, { name: 'analytics' });

module.exports = {};
