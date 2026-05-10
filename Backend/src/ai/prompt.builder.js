const buildPrompt = ({
  user = {},
  history = [],
  mood = "happy",
  language = "Hindi",
  query = "",
  recommendations = [],
}) => {
  return `
You are WaveX AI DJ.

User Preferences:
${JSON.stringify(user.preferences || {})}

Recent Activity:
${JSON.stringify(history)}

Mood:
${mood}

Preferred Language:
${language}

Recommendation Context:
${JSON.stringify(recommendations)}

User Query:
${query}

Suggest:
- songs
- playlists
- artists
- moods

Focus on Indian music intelligence.
`;
};

module.exports = {
  buildPrompt,
};
