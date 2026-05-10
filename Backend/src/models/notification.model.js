const mongoose =
  require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema
            .Types.ObjectId,

        ref: "user",
      },

      message: String,

      read: {
        type: Boolean,
        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "notification",
    notificationSchema
  );