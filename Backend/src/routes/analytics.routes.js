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

const analyticsController =
  require(
    "../controllers/analytics.controller"
  );

router.get(
  "/platform",

  protect,

  authorize("admin"),

  analyticsController.getPlatformAnalytics
);

module.exports =
  router;