const ffmpeg =
  require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");

const fs =
  require("fs/promises");

const path =
  require("path");

const logger =
  require("../config/logger");

ffmpeg.setFfmpegPath(
  ffmpegPath
);

/* =========================================
   🚀 BANDWIDTH MAP
========================================= */

const bandwidthMap = {
  "64k": 64000,
  "128k": 128000,
  "320k": 320000,
};

/* =========================================
   🚀 GENERATE SINGLE HLS VARIANT
========================================= */

const generateVariant =
  (
    input,
    outputDir,
    bitrate
  ) => {

    return new Promise(
      async (
        resolve,
        reject
      ) => {

        try {

          const folder =
            path.join(
              outputDir,
              bitrate
            );

          await fs.mkdir(
            folder,
            {
              recursive:
                true,
            }
          );

          const output =
            path.join(
              folder,
              "index.m3u8"
            );

          const command =
            ffmpeg(input)

              .audioCodec(
                "aac"
              )

              .audioBitrate(
                bitrate
              )

              .format("hls")

              .outputOptions([
                "-hls_time 10",
                "-hls_playlist_type vod",
                "-hls_list_size 0",
              ])

              .save(output)

              .on(
                "end",

                () => {

                  resolve({
                    bitrate,

                    bandwidth:
                      bandwidthMap[
                        bitrate
                      ],

                    playlist:
                      `${bitrate}/index.m3u8`,
                  });
                }
              )

              .on(
                "error",

                async (
                  err
                ) => {

                  logger.error({
                    message:
                      "HLS variant generation failed",

                    bitrate,

                    error:
                      err.message,
                  });

                  try {

                    await fs.rm(
                      folder,
                      {
                        recursive:
                          true,

                        force: true,
                      }
                    );

                  } catch {}

                  reject(err);
                }
              );

          /* =================================
             🚨 TIMEOUT PROTECTION
          ================================= */

          setTimeout(
            () => {

              try {

                command.kill(
                  "SIGKILL"
                );

              } catch {}
            },

            120000
          );

        } catch (err) {

          reject(err);
        }
      }
    );
  };

/* =========================================
   🚀 GENERATE MASTER PLAYLIST
========================================= */

const generateMasterPlaylist =
  async (
    outputDir,
    variants
  ) => {

    let content =
      "#EXTM3U\n#EXT-X-VERSION:3\n";

    variants.forEach(
      (
        variant
      ) => {

        content +=
          `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidthMap[variant.bitrate]},CODECS="mp4a.40.2"\n`;

        content +=
          `${variant.playlist}\n`;
      }
    );

    const master =
      path.join(
        outputDir,
        "master.m3u8"
      );

    await fs.writeFile(
      master,
      content
    );

    return master;
  };

/* =========================================
   🚀 GENERATE HLS
========================================= */

const generateHLS =
  async (
    input,
    outputDir
  ) => {

    await fs.mkdir(
      outputDir,
      {
        recursive:
          true,
      }
    );

    const settled =
      await Promise.allSettled([
        generateVariant(
          input,
          outputDir,
          "64k"
        ),

        generateVariant(
          input,
          outputDir,
          "128k"
        ),

        generateVariant(
          input,
          outputDir,
          "320k"
        ),
      ]);

    const variants =
      settled

        .filter(
          (
            r
          ) =>
            r.status ===
            "fulfilled"
        )

        .map(
          (
            r
          ) => r.value
        );

    if (
      variants.length === 0
    ) {

      throw new Error(
        "All HLS variants failed"
      );
    }

    const master =
      await generateMasterPlaylist(
        outputDir,
        variants
      );

    return {
      playlist:
        master,

      variants,
    };
  };

module.exports = {
  generateHLS,
};