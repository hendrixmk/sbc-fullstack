// routes/postRoutes.js
const express = require("express");
const router  = express.Router();
const { getApprovedPosts } = require("../controllers/postController");

// GET /api/posts — public approved posts
router.get("/", getApprovedPosts);

module.exports = router;
