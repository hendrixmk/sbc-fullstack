// ============================================================
// controllers/adminController.js — Admin Dashboard Operations
// ============================================================

const User     = require("../models/User");
const Post     = require("../models/Post");
const Gallery  = require("../models/Gallery");
const Event    = require("../models/Event");
const Feedback = require("../models/Feedback");
const { cloudinary } = require("../config/cloudinary");

// ================================================================
// DASHBOARD STATISTICS
// ================================================================

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [
      totalMembers,
      pendingMembers,
      totalPosts,
      pendingPosts,
      totalGallery,
      pendingGallery,
      totalEvents,
      unreadFeedback
    ] = await Promise.all([
      User.countDocuments({ role: "member" }),
      User.countDocuments({ role: "member", approved: false }),
      Post.countDocuments(),
      Post.countDocuments({ status: "pending" }),
      Gallery.countDocuments(),
      Gallery.countDocuments({ status: "pending" }),
      Event.countDocuments(),
      Feedback.countDocuments({ isRead: false })
    ]);

    res.json({
      totalMembers,
      pendingMembers,
      totalPosts,
      pendingPosts,
      totalGallery,
      pendingGallery,
      totalEvents,
      unreadFeedback
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

// ================================================================
// USER MANAGEMENT
// ================================================================

// GET /api/admin/users — List all members
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).sort({ createdAt: -1 });
    // Map _id to id so frontend works with both
    const mapped = users.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email,
      approved: u.approved,
      designation: u.designation,
      profilePicture: u.profilePicture,
      createdAt: u.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// PUT /api/admin/users/:id/approve — Approve a pending member
const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve user" });
  }
};

// DELETE /api/admin/users/:id — Remove a member
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent deleting another admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin account" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

// ================================================================
// EVENT MANAGEMENT
// ================================================================

// POST /api/admin/events — Create a new event
const createEvent = async (req, res) => {
  try {
    const { title, date, description, location } = req.body;

    if (!title || !date || !description) {
      return res.status(400).json({ message: "Title, date, and description are required" });
    }

    const event = await Event.create({
      title,
      date,
      description,
      location: location || "Singgimari Baptist Church",
      createdBy: req.user._id
    });

    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: "Failed to create event" });
  }
};

// DELETE /api/admin/events/:id — Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event" });
  }
};

// ================================================================
// POST / BLOG MANAGEMENT
// ================================================================

// GET /api/admin/posts — All posts (for admin review)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      id: p._id,
      title: p.title,
      content: p.content,
      imageUrl: p.imageUrl,
      authorName: p.authorName,
      status: p.status,
      createdAt: p.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

// PUT /api/admin/posts/:id/approve — Approve a blog post
const approvePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post approved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve post" });
  }
};

// DELETE /api/admin/posts/:id — Delete a blog post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Delete image from Cloudinary if it exists
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

// ================================================================
// GALLERY MANAGEMENT
// ================================================================

// GET /api/admin/gallery — All gallery images
const getAllGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    const mapped = images.map(img => ({
      id: img._id,
      imageUrl: img.imageUrl,
      caption: img.caption,
      uploaderName: img.uploaderName,
      status: img.status,
      createdAt: img.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
};

// PUT /api/admin/gallery/:id/approve — Approve a gallery image
const approveGalleryImage = async (req, res) => {
  try {
    const img = await Gallery.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!img) return res.status(404).json({ message: "Image not found" });
    res.json({ message: "Image approved" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve image" });
  }
};

// DELETE /api/admin/gallery/:id — Delete a gallery image
const deleteGalleryImage = async (req, res) => {
  try {
    const img = await Gallery.findById(req.params.id);
    if (!img) return res.status(404).json({ message: "Image not found" });

    // Delete from Cloudinary
    if (img.imagePublicId) {
      await cloudinary.uploader.destroy(img.imagePublicId);
    }

    await img.deleteOne();
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete image" });
  }
};

// ================================================================
// FEEDBACK MANAGEMENT
// ================================================================

// GET /api/admin/feedback — All feedback messages
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
};

// PUT /api/admin/feedback/:id/read — Mark feedback as read
const markFeedbackRead = async (req, res) => {
  try {
    await Feedback.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update feedback" });
  }
};

// DELETE /api/admin/feedback/:id — Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete feedback" });
  }
};

module.exports = {
  getStats,
  getAllUsers, approveUser, deleteUser,
  createEvent, deleteEvent,
  getAllPosts, approvePost, deletePost,
  getAllGallery, approveGalleryImage, deleteGalleryImage,
  getAllFeedback, markFeedbackRead, deleteFeedback
};
