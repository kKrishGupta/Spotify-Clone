const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activity.controller');
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, activityController.trackActivity);
router.get("/", protect, activityController.getUserActivity);
router.get("/feed", protect, activityController.getGlobalFeed);

module.exports = router;