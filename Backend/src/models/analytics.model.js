const mongoose =
  require("mongoose");

const analyticsSchema =
  new mongoose.Schema(
    {
      // 🚀 EVENT TYPE
      type: {
        type: String,

        enum: [
          "play",
          "like",
          "skip",
          "search",
          "playlist_add",
          "follow",
          "session",
          "share",
        ],

        required: true,

        index: true,
      },

      // 👤 USER
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "user",

        index: true,
      },

      // 🎵 SONG
      songId: {
        type: String,

        default: null,

        index: true,
      },

      // 🎤 ARTIST
      artistId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "user",

        default: null,
      },

      // 🎧 GENRE
      genre: {
        type: String,

        default: "",
      },

      // 🌎 REGION
      region: {
        type: String,

        default: "India",
      },

      // ⏱ SESSION DATA
      duration: {
        type: Number,

        default: 0,
      },

      completionRate: {
        type: Number,

        default: 0,
      },

      skipped: {
        type: Boolean,

        default: false,
      },

      // 🔥 SCORING
      score: {
        type: Number,

        default: 1,
      },

      // 📦 EXTRA
      meta: {
        type: Object,

        default: {},
      },
    },

    {
      timestamps: true,
    }
  );

analyticsSchema.index({
  createdAt: -1,
});

analyticsSchema.index({
  user: 1,
  type: 1,
});

analyticsSchema.index({
  songId: 1,
  type: 1,
});

module.exports =
  mongoose.model(
    "analytics",
    analyticsSchema
  );