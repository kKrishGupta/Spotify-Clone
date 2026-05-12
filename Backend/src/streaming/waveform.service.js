const ffmpeg =
  require("fluent-ffmpeg");

const ffmpegPath =
  require("ffmpeg-static");

const fs =
  require("fs/promises");

const path =
  require("path");

ffmpeg.setFfmpegPath(
  ffmpegPath
);

/* =========================================
   🚀 GENERATE WAVEFORM
========================================= */

const generateWaveform =
  async (
    inputFile
  ) => {

    const waveformDir =
      path.join(
        "uploads",
        "waveforms"
      );

    await fs.mkdir(
      waveformDir,
      {
        recursive:
          true,
      }
    );

    const id =
      `${Date.now()}`;

    const output =
      path.join(
        waveformDir,
        `${id}.png`
      );

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const command =
          ffmpeg(inputFile)

            .complexFilter([
              "showwavespic=s=1200x200:colors=white",
            ])

            .frames(1)

            .output(output)

            .on(
              "end",

              () =>

                resolve({
                  waveform:
                    output,
                })
            )

            .on(
              "error",

              async (
                err
              ) => {

                try {

                  await fs.rm(
                    output,
                    {
                      force: true,
                    }
                  );

                } catch {}

                reject(err);
              }
            )

            .run();

        // 🚨 TIMEOUT
        setTimeout(
          () => {

            try {

              command.kill(
                "SIGKILL"
              );

            } catch {}
          },

          60000
        );
      }
    );
  };

module.exports = {
  generateWaveform,
};