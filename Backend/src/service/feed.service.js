const {
  getPersonalizedFeed,
} = require(
  "./recommendation.service"
);

const {
  getTrendingSongs,
} = require(
  "./trending.service"
);

const {
  getHybridSongs,
} = require(
  "./music.service"
);

const buildFeed =
  async (userId) => {

    const [
      personalized,
      trending,
      hybrid,
    ] =
      await Promise.all([
        getPersonalizedFeed(
          userId
        ),

        getTrendingSongs(),

        getHybridSongs(),
      ]);

    const combined = [
      ...personalized,
      ...trending,
      ...hybrid,
    ];

    const unique =
      [];

    const seen =
      new Set();

    for (const song of combined) {

      const id =
        song.id ||
        song._id?.toString();

      if (
        !id ||
        seen.has(id)
      )
        continue;

      seen.add(id);

      unique.push(song);
    }

    return unique.slice(
      0,
      50
    );
  };

module.exports = {
  buildFeed,
};