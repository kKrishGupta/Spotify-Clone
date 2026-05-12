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

const fetchJamendoSongs =
  async () => {

    try {

      const res =
        await withTimeout(

          axios.get(
            "https://api.jamendo.com/v3.0/tracks",

            {
              params: {
                client_id:
                  process.env
                    .JAMENDO_CLIENT_ID,

                format:
                  "json",

                limit: 50,
              },
            }
          ),

          8000
        );

      return (
        res.data.results || []
      ).map(
        (
          track
        ) => ({

          id:
            `jam-${track.id}`,

          title:
            track.name,

          artist:
            track.artist_name,

          uri:
            track.audio,

          cover:
            track.image,

          source:
            "jamendo",
        })
      );

    } catch (err) {

      logger.warn({
        message:
          "Jamendo provider failed",

        error:
          err.message,
      });

      return [];
    }
  };

module.exports = {
  fetchJamendoSongs,
};