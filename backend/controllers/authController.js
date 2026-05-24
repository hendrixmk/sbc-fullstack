// ============================================================
// controllers/authController.js — Register & Login
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Helper: generate a signed JWT token ──
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// ── POST /api/auth/register  (also /api/users/register for compat) ──
// Anyone can register — but they must wait for admin approval
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Create the user — password will be hashed by the pre-save hook in User model
    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "Registration successful! Please wait for admin approval before logging in."
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ── POST /api/auth/login  (also /api/users/login for compat) ──
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user and explicitly include password (it's excluded by default)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with hashed password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if admin has approved this member
    if (user.role !== "admin" && !user.approved) {
      return res.status(403).json({
        message: "Your account is pending approval. Please wait for admin confirmation."
      });
    }

    // Success — send back token + basic user info
    res.json({
      token: generateToken(user._id),
      role: user.role,
      name: user.name,
      email: user.email,
      approved: user.approved,
      profilePicture: user.profilePicture,
      designation: user.designation
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ── GET /api/auth/me — Get current logged-in user ──
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getMe };
