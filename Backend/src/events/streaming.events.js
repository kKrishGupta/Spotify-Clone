const emitProcessingComplete =
  (
    io,
    payload
  ) => {

    io.emit(
      "music:processed",
      payload
    );
  };

const emitProcessingFailed =
  (
    io,
    payload
  ) => {

    io.emit(
      "music:processing_failed",
      payload
    );
  };

  const emitStreamingMetrices = (
    io, payload
  ) =>{
    io.emit(
      "stream:metrices",
      payload
    );
  };

module.exports = {
  emitProcessingComplete,
  emitStreamingMetrices,
  emitProcessingFailed,
};