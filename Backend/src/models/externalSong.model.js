const mongoose =
  require("mongoose");

const externalSongSchema =
  new mongoose.Schema(
    {
      externalId: {
        type: String,
        required: true,
        unique: true,
      },

      title: String,

      artist: String,

      cover: String,

      uri: String,

      source: String,

      plays: {
        type: Number,
        default: 0,
      },

      likes: {
        type: Number,
        default: 0,
      },

      usersLiked: [
        {
          type:
            mongoose.Schema
              .Types.ObjectId,

          ref: "user",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "ExternalSong",
    externalSongSchema
  );