const { Worker } = require("bullmq");
const { createBullMQConnection } = require("../config/bullmq");
const logger = require("../config/logger");
const { getIO } = require("../config/socket");
const musicModel = require("../models/music.model");
const QUEUES = require("../constants/queues");
const { processAudio } = require("../streaming/audio.processor");

const worker = new Worker(
  QUEUES.AUDIO_PROCESSING,
  async (job) => {
    logger.info({
      message: "Processing audio",
      jobId: job.id,
      musicId: job.data?.musicId,
    });

    const result = await processAudio(job.data);

    if (job.data?.musicId) {
      await musicModel.findByIdAndUpdate(
  job.data.musicId,

  {
    waveform:
      result.waveform?.waveform || "",

    hls:
      result.hls?.playlist || "",

    duration:
      result.metadata?.duration || 0,

    processedFiles: {
      bitrates:
        result.bitrates || [],
    },

    quality: [
      "64kbps",
      "128kbps",
      "320kbps",
    ],

    status:
      "approved",
  }
)
    }

    const io = getIO();
    if (io) {
      io.emit("music:processed", {
        musicId: job.data?.musicId,
        waveform: result.waveform?.waveform,
        hls: result.hls?.playlist,
      });
    }

    return result;
  },
  {
    connection: createBullMQConnection("audio-worker"),
    concurrency: Number(process.env.AUDIO_WORKER_CONCURRENCY || 2),
  }
);

worker.on("completed", (job) => {
  logger.info({
    message: "Audio job completed",
    jobId: job.id,
  });
});

worker.on("failed", (job, err) => {
  logger.error({
    message: "Audio job failed",
    jobId: job?.id,
    musicId: job?.data?.musicId,
    error: err.message,
  });
});

module.exports = worker;
