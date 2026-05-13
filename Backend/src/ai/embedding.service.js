const {
  upsertVector,
  getVector,
} = require(
  "./vector.service"
);

/* =========================================
   🚀 GENERATE EMBEDDING
========================================= */

const generateEmbedding =
  async (text) => {

    if (!text) {

      return [];
    }

    // ⚠️ Temporary lightweight embedding
    // Replace later with real AI vectors

    return text
      .toLowerCase()
      .split(/\s+/)
      .map(
        (
          token
        ) => token.length
      );
  };

/* =========================================
   🚀 UPDATE USER EMBEDDING
========================================= */

const updateUserEmbedding =
  async (
    userId,
    payload
  ) => {

    const existing =
      (
        await getVector(
          "user",
          userId
        )
      ) || {};

    const updated = {

      plays:
        (
          existing.plays ||
          0
        ) +

        (
          payload.type ===
          "play"

            ? 1
            : 0
        ),

      likes:
        (
          existing.likes ||
          0
        ) +

        (
          payload.type ===
          "like"

            ? 1
            : 0
        ),

      skips:
        (
          existing.skips ||
          0
        ) +

        (
          payload.skipped
            ? 1
            : 0
        ),

      duration:
        (
          existing.duration ||
          0
        ) +

        (
          payload.duration ||
          0
        ),

      genres: {

        ...(
          existing.genres ||
          {}
        ),

        [payload.genre]:

          (
            existing
              ?.genres?.[
              payload.genre
            ] || 0
          ) + 1,
      },

      moods: {

        ...(
          existing.moods ||
          {}
        ),

        [payload.mood]:

          (
            existing
              ?.moods?.[
              payload.mood
            ] || 0
          ) + 1,
      },

      updatedAt:
        Date.now(),
    };

    await upsertVector(
      "user",
      userId,
      updated
    );

    return updated;
  };

module.exports = {
  generateEmbedding,
  updateUserEmbedding,
};