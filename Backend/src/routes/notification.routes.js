const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} = require(
  "../middlewares/auth.middleware"
);

const notificationController =
  require(
    "../controllers/notification.controller"
  );

router.get(
  "/",
  protect,
  notificationController.getNotifications
);

router.put(
  "/read/:id",
  protect,
  notificationController.markAsRead
);

router.delete(
  "/:id",
  protect,
  notificationController.deleteNotification
);

module.exports =
  router;