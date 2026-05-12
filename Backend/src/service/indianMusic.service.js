const youtubesearchapi =
  require(
    "youtube-search-api"
  );

const {
  withTimeout,
} = require(
  "./providerFailover.service"
);

const logger =
  require(
    "../config/logger"
  );

const fetchIndianSongs =
  async () => {

    try {

      const queries = [
        "bollywood songs",
        "arijit singh",
        "bhajan songs",
        "hindi romantic songs",
        "punjabi songs",
      ];

      let results = [];

      for (const q of queries) {

        try {

          const res =
            await withTimeout(

              youtubesearchapi.GetListByKeyword(
                q,
                false,
                10
              ),

              8000
            );

          results.push(
            ...(res.items || [])
          );

        } catch (err) {

          logger.warn({
            message:
              "YouTube provider query failed",

            query:
              q,

            error:
              err.message,
          });
        }
      }

      return results.map(
        (
          song
        ) => ({

          id:
            `yt-${song.id}`,

          title:
            song.title,

          artist:
            song.channelTitle,

          cover:
            song.thumbnail
              ?.thumbnails?.[0]
              ?.url,

          uri:
            `https://www.youtube.com/watch?v=${song.id}`,

          source:
            "youtube",
        })
      );

    } catch (err) {

      logger.warn({
        message:
          "YouTube provider failed",

        error:
          err.message,
      });

      return [];
    }
  };

module.exports = {
  fetchIndianSongs,
};