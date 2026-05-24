// ============================================================
// controllers/galleryController.js — Public Gallery Endpoints
// ============================================================

const Gallery = require("../models/Gallery");

// GET /api/gallery — Get all approved gallery images (public)
const getApprovedGallery = async (req, res) => {
  try {
    const images = await Gallery.find({ status: "approved" }).sort({ createdAt: -1 });
    const mapped = images.map(img => ({
      id: img._id,
      imageUrl: img.imageUrl,
      caption: img.caption,
      uploaderName: img.uploaderName,
      createdAt: img.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
};

module.exports = { getApprovedGallery };
