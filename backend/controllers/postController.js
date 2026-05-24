// ============================================================
// controllers/postController.js — Public Post Endpoints
// ============================================================

const Post = require("../models/Post");

// GET /api/posts — Get all approved posts (public)
const getApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" }).sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      id: p._id,
      title: p.title,
      content: p.content,
      imageUrl: p.imageUrl,
      authorName: p.authorName,
      createdAt: p.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

module.exports = { getApprovedPosts };
