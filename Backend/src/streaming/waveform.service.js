const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const fs = require("fs/promises");
const path = require("path");

ffmpeg.setFfmpegPath(ffmpegPath);

const ensureDir = (dir) =>
  fs.mkdir(dir, {
    recursive: true,
  });

const safeUnlink = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
};

const generateWaveform = async (inputFile) => {
  const waveformDir = path.join("uploads", "waveforms");
  const tempDir = path.join("uploads", "temp");

  await ensureDir(waveformDir);
  await ensureDir(tempDir);

  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const outputJson = path.join(waveformDir, `${id}.json`);
  const tempRaw = path.join(tempDir, `${id}.raw`);

  return new Promise((resolve, reject) => {
    const waveformData = [];

    ffmpeg(inputFile)
      .audioFilters("aformat=channel_layouts=mono")
      .format("f32le")
      .on("error", async (err) => {
        await safeUnlink(tempRaw).catch(() => {});
        reject(err);
      })
      .on("end", async () => {
        try {
          for (let i = 0; i < 200; i += 1) {
            waveformData.push(Math.floor(Math.random() * 100));
          }

          await fs.writeFile(outputJson, JSON.stringify(waveformData));
          await safeUnlink(tempRaw);

          resolve({
            waveform: outputJson,
            peaks: waveformData,
          });
        } catch (err) {
          reject(err);
        }
      })
      .saveToFile(tempRaw);
  });
};

module.exports = {
  generateWaveform,
};
