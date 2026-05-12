const express =
  require("express");

const router =
  express.Router();

const {
  register,
} = require(
  "../metrics/prometheus"
);

router.get(
  "/prometheus",

  async (
    req,
    res
  ) => {

    res.set(
      "Content-Type",
      register.contentType
    );

    res.end(
      await register.metrics()
    );
  }
);

module.exports =
  router;