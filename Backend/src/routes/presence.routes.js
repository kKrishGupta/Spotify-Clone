const express = require("express");

const router = express.Router();

const {getPresence,} = require("../controllers/presence.controller");

router.get( "/:id",getPresence);

module.exports = router;