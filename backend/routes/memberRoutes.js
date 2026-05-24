// ============================================================
// routes/memberRoutes.js — All routes require login + approved
// ============================================================

const express = require("express");
const router  = express.Router();
const { protect, approvedOnly } = require("../middleware/authMiddleware");
const {
  uploadPostImage,
  uploadGalleryImage: uploadGalleryMulter,
  uploadProfileImage
} = require("../config/cloudinary");
const {
  getProfile,
  updateProfile,
  updateProfilePicture,
  changePassword,
  submitPost,
  getMyPosts,
  uploadGalleryImage,
  getMyGallery
} = require("../controllers/memberController");

// All routes require login and admin approval
router.use(protect, approvedOnly);

// Profile
router.get("/profile",            getProfile);
router.put("/profile",            updateProfile);
router.put(
  "/profile/picture",
  uploadProfileImage.single("profilePicture"),   // field name in form
  updateProfilePicture
);
router.put("/change-password", changePassword);

// Posts / Blogs
// uploadPostImage.single("image") handles the optional file upload
router.post(
  "/posts",
  uploadPostImage.single("image"),
  submitPost
);
router.get("/posts", getMyPosts);

// Gallery
router.post(
  "/gallery",
  uploadGalleryMulter.single("image"),
  uploadGalleryImage
);
router.get("/gallery", getMyGallery);

module.exports = router;
