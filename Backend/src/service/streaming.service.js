const {
  processAudio,
} = require(
  "../streaming/audio.processor"
);

const processStreaming =
  async (audio) => {
    return await processAudio(
      audio
    );
  };

module.exports = {
  processStreaming,
};