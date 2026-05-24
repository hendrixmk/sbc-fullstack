// ============================================================
// models/Post.js — Blog/Article Post Model
// ============================================================

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Post content is required"]
    },
    // Cloudinary image URL (optional)
    imageUrl: {
      type: String,
      default: ""
    },
    // Cloudinary public_id — needed to delete image from Cloudinary
    imagePublicId: {
      type: String,
      default: ""
    },
    // Reference to the member who wrote this post
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // Stored separately so we don't need to populate author each time
    authorName: {
      type: String,
      default: ""
    },
    // Admin must approve before it shows publicly
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

module.exports = mongoose.model("Post", postSchema);
