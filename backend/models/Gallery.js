// ============================================================
// models/Gallery.js — Gallery Image Model
// ============================================================

const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    // Cloudinary URL of the image
    imageUrl: {
      type: String,
      required: true
    },
    // Cloudinary public_id — needed to delete from Cloudinary
    imagePublicId: {
      type: String,
      default: ""
    },
    caption: {
      type: String,
      default: "",
      trim: true
    },
    // Who uploaded this image
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    uploaderName: {
      type: String,
      default: ""
    },
    // Admin must approve before it shows in public gallery
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Gallery", gallerySchema);
