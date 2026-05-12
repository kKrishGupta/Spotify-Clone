const axios =
  require("axios");

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

      const res =
        await withTimeout(

          axios.get(
            "https://api.deezer.com/chart/0/tracks",

            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0",
              },
            }
          ),

          8000
        );

      return (
        res.data.data || []
      ).map(
        (
          song
        ) => ({

          id:
            `ind-${song.id}`,

          title:
            song.title,

          artist:
            song.artist?.name,

          cover:
            song.album
              ?.cover_medium,

          uri:
            song.preview,

          source:
            "deezer-chart",
        })
      );

    } catch (err) {

      logger.warn({
        message:
          "Deezer provider failed",

        error:
          err.message,
      });

      return [];
    }
  };

module.exports = {
  fetchIndianSongs,
};