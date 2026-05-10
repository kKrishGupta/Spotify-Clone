const recommendSongs = async (
  user
) => {
  return {
    recommendations: [],
    user,
  };
};

module.exports = {
  recommendSongs,
};