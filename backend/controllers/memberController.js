// ============================================================
// controllers/memberController.js — Member Dashboard Operations
// ============================================================

const User    = require("../models/User");
const Post    = require("../models/Post");
const Gallery = require("../models/Gallery");
const { cloudinary } = require("../config/cloudinary");

// ── GET /api/member/profile — Get current member's profile ──
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// ── PUT /api/member/profile — Update name, designation, bio, phone ──
const updateProfile = async (req, res) => {
  try {
    const { name, designation, bio, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, designation, bio, phone },
      { new: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ── PUT /api/member/profile/picture — Upload new profile picture ──
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // req.file.path is the Cloudinary URL (set by multer-storage-cloudinary)
    const imageUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: imageUrl },
      { new: true }
    );

    res.json({ message: "Profile picture updated", profilePicture: imageUrl });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};

// ── PUT /api/member/change-password — Change password ──
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both fields are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Fetch user WITH password (it's excluded by default)
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Set new password — pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to change password" });
  }
};

// ── POST /api/member/posts — Submit a blog post for review ──
const submitPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    // Handle optional image upload
    let imageUrl = "";
    let imagePublicId = "";
    if (req.file) {
      imageUrl = req.file.path;          // Cloudinary URL
      imagePublicId = req.file.filename; // Cloudinary public_id
    }

    const post = await Post.create({
      title,
      content,
      imageUrl,
      imagePublicId,
      author: req.user._id,
      authorName: req.user.name,
      status: "pending" // waits for admin approval
    });

    res.status(201).json({ message: "Blog submitted for review", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit post" });
  }
};

// ── GET /api/member/posts — Get this member's own posts ──
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      id: p._id,
      title: p.title,
      content: p.content,
      imageUrl: p.imageUrl,
      status: p.status,
      createdAt: p.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your posts" });
  }
};

// ── POST /api/member/gallery — Upload gallery image ──
const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const image = await Gallery.create({
      imageUrl:      req.file.path,
      imagePublicId: req.file.filename,
      caption:       req.body.caption || "",
      uploadedBy:    req.user._id,
      uploaderName:  req.user.name,
      status: "pending"
    });

    res.status(201).json({ message: "Image submitted for review", image });
  } catch (err) {
    res.status(500).json({ message: "Failed to upload image" });
  }
};

// ── GET /api/member/gallery — Get this member's uploaded images ──
const getMyGallery = async (req, res) => {
  try {
    const images = await Gallery.find({ uploadedBy: req.user._id }).sort({ createdAt: -1 });
    const mapped = images.map(img => ({
      id: img._id,
      imageUrl: img.imageUrl,
      caption: img.caption,
      status: img.status,
      createdAt: img.createdAt
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your gallery" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateProfilePicture,
  changePassword,
  submitPost,
  getMyPosts,
  uploadGalleryImage,
  getMyGallery
};
