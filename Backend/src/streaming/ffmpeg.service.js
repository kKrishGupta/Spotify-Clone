const ffmpeg = require(
  "fluent-ffmpeg"
);

const ffmpegPath = require(
  "ffmpeg-static"
);
const fs = require("fs/promises");
const path = require("path");

ffmpeg.setFfmpegPath(
  ffmpegPath
);

const convertBitrates = (
  input,
  outputDir
) => {
  const targetDir = path.resolve(outputDir);

  return Promise.all([
    fs.mkdir(targetDir, { recursive: true }).then(() =>
    convert(
      input,
      path.join(targetDir, "64.mp3"),
      "64k"
    )),

    fs.mkdir(targetDir, { recursive: true }).then(() =>
    convert(
      input,
      path.join(targetDir, "128.mp3"),
      "128k"
    )),

    fs.mkdir(targetDir, { recursive: true }).then(() =>
    convert(
      input,
      path.join(targetDir, "320.mp3"),
      "320k"
    )),
  ]);
};

const convert = (
  input,
  output,
  bitrate
) => {
  return new Promise(
    (resolve, reject) => {
      ffmpeg(input)
        .audioBitrate(
          bitrate
        )
        .save(output)
        .on("end", () =>
          resolve(output)
        )
        .on(
          "error",
          reject
        );
    }
  );
};

module.exports = {
  convertBitrates,
};
