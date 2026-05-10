const musicModel = require("../models/music.model");
const userModel = require("../models/user.model");

const getPlatformAnalytics = async() =>{
  const totalSongs = await musicModel.countDocuments();
  const totalUsers = await userModel.countDocuments();

   const totalPlaysAgg = await musicModel.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$plays" },
      },
    },
  ]);

  return {
    totalSongs,
    totalUsers,
    totalPlays:
      totalPlaysAgg[0]?.total || 0,
  };
}

module.exports = {
  getPlatformAnalytics
}