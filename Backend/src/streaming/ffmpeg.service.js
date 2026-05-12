const ffmpeg =
  require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");

const ffprobePath =
  require("ffprobe-static").path;

const fs =
  require("fs/promises");

const path =
  require("path");

const logger =
  require("../config/logger");

ffmpeg.setFfmpegPath(
  ffmpegPath
);

ffmpeg.setFfprobePath(
  ffprobePath
);

/* =========================================
   🚀 ENSURE DIRECTORY
========================================= */

const ensureDir =
  async (dir) => {

    await fs.mkdir(dir, {
      recursive: true,
    });
  };

/* =========================================
   🚀 VALIDATE INPUT FILE
========================================= */

const validateInput =
  async (input) => {

    try {

      await fs.access(input);

    } catch {

      throw new Error(
        `Input file not found: ${input}`
      );
    }
  };

/* =========================================
   🚀 AUDIO METADATA
========================================= */

const getAudioMetadata =
  async (input) => {

    await validateInput(
      input
    );

    return new Promise(
      (
        resolve,
        reject
      ) => {

        ffmpeg.ffprobe(
          input,

          (
            err,
            data
          ) => {

            if (err) {

              return reject(
                new Error(
                  `FFprobe failed: ${err.message}`
                )
              );
            }

            const audio =
              data.streams.find(
                (
                  s
                ) =>
                  s.codec_type ===
                  "audio"
              );

            resolve({
              duration:
                Number(
                  data.format
                    ?.duration || 0
                ),

              bitrate:
                Number(
                  data.format
                    ?.bit_rate || 0
                ),

              codec:
                audio
                  ?.codec_name || "",

              sampleRate:
                Number(
                  audio
                    ?.sample_rate || 0
                ),

              channels:
                audio
                  ?.channels || 0,
            });
          }
        );
      }
    );
  };

/* =========================================
   🚀 CONVERT SINGLE BITRATE
========================================= */

const convert =
  async (
    input,
    output,
    bitrate
  ) => {

    await validateInput(
      input
    );

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const command =
          ffmpeg(input)

            // 🚨 TIMEOUT
            .timeout(300)

            .audioCodec(
              "libmp3lame"
            )

            .audioBitrate(
              bitrate
            )

            .format("mp3")

            .on(
              "start",

              (
                cmd
              ) => {

                logger.info({
                  message:
                    "FFmpeg conversion started",

                  bitrate,

                  command:
                    cmd,
                });
              }
            )

            .on(
              "end",

              () => {

                logger.info({
                  message:
                    "FFmpeg conversion completed",

                  bitrate,

                  output,
                });

                resolve(
                  output
                );
              }
            )

            .on(
              "error",

              async (
                err
              ) => {

                logger.error({
                  message:
                    "FFmpeg conversion failed",

                  bitrate,

                  error:
                    err.message,
                });

                try {

                  await fs.rm(
                    output,
                    {
                      force: true,
                    }
                  );

                } catch {}

                return reject(
                  new Error(
                    `FFmpeg processing failed: ${err.message}`
                  )
                );
              }
            )

            .save(output);

        /* =================================
           🚨 HARD KILL SAFETY
        ================================= */

        setTimeout(
          () => {

            try {

              command.kill(
                "SIGKILL"
              );

              logger.warn({
                message:
                  "FFmpeg process force killed",

                bitrate,
              });

            } catch {}
          },

          300000
        );
      }
    );
  };

/* =========================================
   🚀 MULTI BITRATE CONVERSION
========================================= */

const convertBitrates =
  async (
    input,
    outputDir
  ) => {

    await validateInput(
      input
    );

    await ensureDir(
      outputDir
    );

    const outputs = [
      {
        bitrate:
          "64k",

        file:
          "64.mp3",
      },

      {
        bitrate:
          "128k",

        file:
          "128.mp3",
      },

      {
        bitrate:
          "320k",

        file:
          "320.mp3",
      },
    ];

    const settled =
      await Promise.allSettled(
        outputs.map(
          async (
            item
          ) => {

            const output =
              path.join(
                outputDir,
                item.file
              );

            await convert(
              input,
              output,
              item.bitrate
            );

            return {
              bitrate:
                item.bitrate,

              path:
                output,
            };
          }
        )
      );

    const results =
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

    const failed =
      settled.filter(
        (
          r
        ) =>
          r.status ===
          "rejected"
      );

    if (
      failed.length > 0
    ) {

      logger.warn({
        message:
          "Some bitrate conversions failed",

        failed:
          failed.length,
      });
    }

    if (
      results.length === 0
    ) {

      throw new Error(
        "All bitrate conversions failed"
      );
    }

    return results;
  };

module.exports = {
  convertBitrates,
  getAudioMetadata,
};