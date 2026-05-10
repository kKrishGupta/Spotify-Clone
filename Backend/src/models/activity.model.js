const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "music",
      required() {
        return ["play", "like", "upload"].includes(this.action);
      },
    },

    action: {
      type: String,
      enum: ["play", "like", "upload", "ai_chat", "recommendation"],
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ song: 1, action: 1 });

module.exports = mongoose.model("activity", activitySchema);
