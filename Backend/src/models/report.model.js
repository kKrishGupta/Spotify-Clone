const mongoose =
  require("mongoose");

const reportSchema =
  new mongoose.Schema(
    {
      reporter: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "user",
      },

      targetId: String,

      targetType: {
        type: String,

        enum: [
          "song",
          "playlist",
          "user",
        ],
      },

      reason: String,

      status: {
        type: String,

        default:
          "pending",
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Report",
    reportSchema
  );