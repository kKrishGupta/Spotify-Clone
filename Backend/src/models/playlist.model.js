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
      ref: "user", // ✅ match model name
      required: true
    },

    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "music" // ✅ match model name
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

playlistSchema.index({
  user: 1,
});

module.exports = mongoose.model("Playlist", playlistSchema);