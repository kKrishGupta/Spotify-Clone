const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ match model name
      required: true
    },

    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song" // ✅ match model name
      }
    ],

    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // ✅ fixed
  }
);

module.exports = mongoose.model("Playlist", playlistSchema);