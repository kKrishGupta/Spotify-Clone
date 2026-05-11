const mongoose =
  require("mongoose");

const playlistSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "user",

        required: true,
      },

      songs: [
        {
          songId: {
            type: String,
            required: true,
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

          uri: {
            type: String,
            default: "",
          },

          addedAt: {
            type: Date,
            default:
              Date.now,
          },
        },
      ],

      isPublic: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

playlistSchema.index({
  user: 1,
});

module.exports =
  mongoose.model(
    "Playlist",
    playlistSchema
  );