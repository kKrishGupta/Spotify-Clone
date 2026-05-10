const detectMood = async (
  text
) => {
  const normalized =
    text.toLowerCase();

  if (
    normalized.includes("sad")
  ) {
    return { mood: "sad" };
  }

  if (
    normalized.includes("gym")
  ) {
    return { mood: "workout" };
  }

  if (
    normalized.includes("study")
  ) {
    return { mood: "focus" };
  }

  return { mood: "happy" };
};

module.exports = {
  detectMood,
};
