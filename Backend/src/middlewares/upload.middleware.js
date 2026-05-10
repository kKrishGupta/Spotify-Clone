const multer = require("multer");

const storage =
  multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize:
      10 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {
    const allowed = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
    ];

    if (
      !allowed.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Invalid audio format"
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;