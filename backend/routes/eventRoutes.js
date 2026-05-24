// routes/eventRoutes.js
const express = require("express");
const router  = express.Router();
const { getEvents } = require("../controllers/eventController");

// GET /api/events — public
router.get("/", getEvents);

module.exports = router;
