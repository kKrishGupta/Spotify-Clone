const moodMap = {
  sad: [
    "sad",
    "cry",
    "heartbreak",
    "alone",
    "pain",
  ],

  workout: [
    "gym",
    "workout",
    "fitness",
    "power",
    "energy",
  ],

  focus: [
    "study",
    "focus",
    "coding",
    "deep work",
  ],

  romantic: [
    "love",
    "romantic",
    "date",
    "couple",
  ],

  chill: [
    "lofi",
    "relax",
    "calm",
    "peaceful",
  ],
};

const detectMood =
  async (
    text = ""
  ) => {

    const normalized =
      text.toLowerCase();

    let bestMood =
      "happy";

    let max = 0;

    for (const [
      mood,
      words,
    ] of Object.entries(
      moodMap
    )) {

      let score = 0;

      for (const word of words) {

        if (
          normalized.includes(
            word
          )
        ) {
          score++;
        }
      }

      if (score > max) {

        max = score;

        bestMood =
          mood;
      }
    }

    return {
      mood:
        bestMood,
    };
  };

module.exports = {
  detectMood,
};