const mongoose =
  require("mongoose");

const activitySchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "user",

        required: true,
      },

      // 🚀 UNIVERSAL SONG SYSTEM
      songId: {
        type: String,

        required() {
          return [
            "play",
            "like",
            "upload",
          ].includes(
            this.action
          );
        },
      },

      source: {
        type: String,

        enum: [
          "upload",
          "youtube",
          "deezer",
          "jamendo",
        ],

        default:
          "upload",
      },

      title: {
        type: String,
        default: "",
      },

      artist: {
        type: String,
        default: "",
      },

      cover: {
        type: String,
        default: "",
      },

      action: {
        type: String,

        enum: [
          "play",
          "like",
          "upload",
          "ai_chat",
          "recommendation",
        ],

        required: true,
      },

      metadata: {
        type:
          mongoose.Schema.Types
            .Mixed,

        default: {},
      },
    },
    {
      timestamps: true,
    }
  );

activitySchema.index({
  user: 1,

  createdAt: -1,
});

activitySchema.index({
  songId: 1,

  action: 1,
});

module.exports =
  mongoose.model(
    "activity",
    activitySchema
  );