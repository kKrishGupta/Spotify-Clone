const path =
  require("path");

const logger =
  require("../config/logger");

const {
  convertBitrates,
  getAudioMetadata,
} = require(
  "./ffmpeg.service"
);

const {
  generateHLS,
} = require(
  "./hls.service"
);

const {
  generateWaveform,
} = require(
  "./waveform.service"
);

const {
  emitStreamingMetrics,
} = require(
  "../events/streaming.events"
);

/* =========================================
   🚀 PROCESS AUDIO
========================================= */

const processAudio =
  async (
    audio,
    io = null,
    job = null
  ) => {

    const inputPath =
      audio.path ||
      audio.inputPath ||
      audio.url ||
      audio.uri;

    if (!inputPath) {

      throw new Error(
        "Audio input path required"
      );
    }

    const outputDir =
      path.join(
        "uploads/processed",

        audio.musicId ||
          Date.now().toString()
      );

    /* =====================================
       📊 RESULT OBJECT
    ===================================== */

    const result = {

      success: true,

      errors: [],

      processingStartedAt:
        new Date(),
    };

    /* =====================================
       🎵 METADATA
    ===================================== */

    try {

      result.metadata =
        await getAudioMetadata(
          inputPath
        );

    } catch (err) {

      result.success =
        false;

      result.errors.push({
        stage:
          "metadata",

        error:
          err.message,
      });

      logger.error({
        message:
          "Metadata extraction failed",

        error:
          err.message,
      });
    }

    /* =====================================
       🎧 BITRATE CONVERSION
    ===================================== */

    try {

      result.bitrates =
        await convertBitrates(
          inputPath,
          outputDir
        );

    } catch (err) {

      result.success =
        false;

      result.errors.push({
        stage:
          "bitrates",

        error:
          err.message,
      });

      logger.error({
        message:
          "Bitrate conversion failed",

        error:
          err.message,
      });
    }

    /* =====================================
       📡 HLS GENERATION
    ===================================== */

    try {

      result.hls =
        await generateHLS(
          inputPath,
          outputDir
        );

    } catch (err) {

      result.success =
        false;

      result.errors.push({
        stage:
          "hls",

        error:
          err.message,
      });

      logger.error({
        message:
          "HLS generation failed",

        error:
          err.message,
      });
    }

    /* =====================================
       📈 WAVEFORM GENERATION
    ===================================== */

    try {

      result.waveform =
        await generateWaveform(
          inputPath
        );

    } catch (err) {

      result.success =
        false;

      result.errors.push({
        stage:
          "waveform",

        error:
          err.message,
      });

      logger.error({
        message:
          "Waveform generation failed",

        error:
          err.message,
      });
    }

    /* =====================================
       📊 STREAMING METRICS
    ===================================== */

    try {

      if (
        io &&
        result.success
      ) {

        emitStreamingMetrics(
          io,

          {
            musicId:
              job?.data
                ?.musicId ||

              audio.musicId,

            bitrates:
              result.bitrates,

            duration:
              result.metadata
                ?.duration,

            processedAt:
              new Date(),
          }
        );
      }

    } catch (err) {

      logger.warn({
        message:
          "Streaming metrics emit failed",

        error:
          err.message,
      });
    }

    /* =====================================
       ✅ COMPLETE
    ===================================== */

    result.processingCompletedAt =
      new Date();

    return result;
  };

module.exports = {
  processAudio,
};