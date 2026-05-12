const rateLimit =
  require("express-rate-limit");

module.exports =
  rateLimit({
    windowMs:
      60 * 1000,

    max: 20,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many AI requests",
    },
  });