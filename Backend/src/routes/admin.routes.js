const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

router.get(
  "/songs",
  protect,
  authorize("admin"),
  adminController.getAllSongsAdmin
);

router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  adminController.approveSong
);

router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  adminController.rejectSong
);

router.delete(
  "/song/:id",
  protect,
  authorize("admin"),
  adminController.deleteSong
);

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  adminController.getAdminDashboard
);

router.post(
  "/notifications/send",
  protect,
  authorize("admin"),
  adminController.sendAdminNotification
);

router.post(
  "/notifications/broadcast",
  protect,
  authorize("admin"),
  adminController.broadcastNotification
);

router.post(
  "/notifications/plan",
  protect,
  authorize("admin"),
  adminController.planNotification
);
module.exports = router;