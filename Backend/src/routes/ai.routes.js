const express = require("express");
const router = express.Router();
const { chat } = require("../controllers/ai.controller");
const { protect } = require("../middlewares/auth.middleware");
const aiRateLimiter = require("../middlewares/aiRateLimiter");
router.post("/chat", protect, chat);
router.post("/chat", protect,aiRateLimiter,chat);

module.exports = router;