// ============================================================
// routes/adminRoutes.js — All routes require admin role
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getStats,
  getAllUsers, approveUser, deleteUser,
  createEvent, deleteEvent,
  getAllPosts, approvePost, deletePost,
  getAllGallery, approveGalleryImage, deleteGalleryImage,
  getAllFeedback, markFeedbackRead, deleteFeedback
} = require("../controllers/adminController");

// All routes below this line require: valid JWT + admin role
router.use(protect, adminOnly);

// Stats
router.get("/stats", getStats);

// Users
router.get("/users",              getAllUsers);
router.put("/users/:id/approve",  approveUser);
router.delete("/users/:id",       deleteUser);

// Events
router.post("/events",            createEvent);
router.delete("/events/:id",      deleteEvent);

// Posts
router.get("/posts",              getAllPosts);
router.put("/posts/:id/approve",  approvePost);
router.delete("/posts/:id",       deletePost);

// Gallery
router.get("/gallery",              getAllGallery);
router.put("/gallery/:id/approve",  approveGalleryImage);
router.delete("/gallery/:id",       deleteGalleryImage);

// Feedback
router.get("/feedback",             getAllFeedback);
router.put("/feedback/:id/read",    markFeedbackRead);
router.delete("/feedback/:id",      deleteFeedback);

module.exports = router;
