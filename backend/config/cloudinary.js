// ============================================================
// config/cloudinary.js — Cloudinary Setup
// ============================================================

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary with credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── Storage: for blog post images ──
const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sbc/posts",          // folder name in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit", quality: "auto" }]
  }
});

// ── Storage: for gallery images ──
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sbc/gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1600, crop: "limit", quality: "auto" }]
  }
});

// ── Storage: for profile pictures ──
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sbc/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face", quality: "auto" }]
  }
});

// ── Multer upload handlers ──
const uploadPostImage    = multer({ storage: postStorage });
const uploadGalleryImage = multer({ storage: galleryStorage });
const uploadProfileImage = multer({ storage: profileStorage });

module.exports = {
  cloudinary,
  uploadPostImage,
  uploadGalleryImage,
  uploadProfileImage
};
