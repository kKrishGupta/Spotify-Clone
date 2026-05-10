const ffmpeg = require(
  "fluent-ffmpeg"
);
const fs = require("fs/promises");
const path = require("path");

const generateHLS = async (
  input,
  outputDir
) => {
  const targetDir = path.resolve(outputDir);
  await fs.mkdir(targetDir, { recursive: true });

  return new Promise(
    (resolve, reject) => {
      ffmpeg(input)
        .outputOptions([
          "-codec copy",
          "-start_number 0",
          "-hls_time 10",
          "-hls_list_size 0",
          "-f hls",
        ])
        .save(
          path.join(targetDir, "index.m3u8")
        )
        .on("end", () =>
          resolve({
            playlist:
              path.join(targetDir, "index.m3u8"),
          })
        )
        .on(
          "error",
          reject
        );
    }
  );
};

module.exports = {
  generateHLS,
};
