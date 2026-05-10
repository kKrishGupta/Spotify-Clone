const generateEmbedding = async (
  text
) => {
  return {
    embedding: [0.12, 0.45, 0.89],
    text,
  };
};

module.exports = {
  generateEmbedding,
};