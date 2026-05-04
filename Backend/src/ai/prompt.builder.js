const buildPrompt = (user, history, query) => {
  return `
User liked songs: ${JSON.stringify(user.likedSongs)}
Recent activity: ${JSON.stringify(history)}

User says: ${query}

Suggest music like a smart assistant.
`;
};

module.exports = { buildPrompt };