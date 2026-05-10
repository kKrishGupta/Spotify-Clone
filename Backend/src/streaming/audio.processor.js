const path = require("path");

const {
  convertBitrates,
} = require("./ffmpeg.service");

const {
  generateHLS,
} = require("./hls.service");

const {
  generateWaveform,
} = require("./waveform.service");

const processAudio = async (
  audio
) => {
  const inputPath =
    audio.path ||
    audio.inputPath ||
    audio.url ||
    audio.uri;

  if (!inputPath) {
    throw new Error("Audio input path or URL is required");
  }

  const outputDir = path.join(
    "uploads/processed",
    audio.filename ||
      audio.musicId ||
      Date.now().toString()
  );

  // 1️⃣ Generate bitrates
  const bitrates =
    await convertBitrates(
      inputPath,
      outputDir
    );

  // 2️⃣ Generate HLS
  const hls =
    await generateHLS(
      inputPath,
      outputDir
    );

  // 3️⃣ Generate waveform
  const waveform =
    await generateWaveform(
      inputPath
    );

  return {
    success: true,
    bitrates,
    hls,
    waveform,
  };
};

module.exports = {
  processAudio,
};
