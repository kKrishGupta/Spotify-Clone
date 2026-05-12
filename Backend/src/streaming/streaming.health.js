const ffmpeg =
  require("fluent-ffmpeg");

const checkFFmpeg =
  async () =>
    new Promise(
      (resolve) => {

        ffmpeg.getAvailableFormats(
          (err) => {

            if (err) {
              return resolve({
                healthy: false,
                error:
                  err.message,
              });
            }

            resolve({
              healthy: true,
            });
          }
        );
      }
    );

module.exports = {
  checkFFmpeg,
};