const logger = require('../config/logger');
const { scheduleJob } = require('../utils/scheduler');

const Song = require('../models/music.model');

scheduleJob('*/30 * * * *', async () => {
  try {
    logger.info(
      'Recalculating trending songs...'
    );

    const trendingSongs =
      await Song.find({})
        .sort({
          plays: -1,
          likes: -1,
        })
        .limit(50);

    logger.info({
      message:
        'Trending songs updated',
      count: trendingSongs.length,
    });

    // TODO:
    // cache in Redis
    // update recommendation engine
    // regional segmentation
  } catch (err) {
    logger.error({
      message:
        'Trending scheduler failed',
      error: err.message,
    });
  }
}, { name: 'trending' });

module.exports = {};
