// routes/galleryRoutes.js
const express = require("express");
const router  = express.Router();
const { getApprovedGallery } = require("../controllers/galleryController");

// GET /api/gallery — public approved images
router.get("/", getApprovedGallery);

module.exports = router;
