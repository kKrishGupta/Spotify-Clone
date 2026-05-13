const express =
  require("express");

const router =
  express.Router();

const {
  protect,
  authorize,
} = require(
  "../middlewares/auth.middleware"
);

const moderationController =
  require(
    "../controllers/moderation.controller"
  );

router.post(
  "/report",
  protect,
  moderationController.report
);

router.get(
  "/reports",
  protect,
  authorize("admin"),
  moderationController.getReports
);

module.exports =
  router;