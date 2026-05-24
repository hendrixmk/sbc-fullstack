// ============================================================
// server.js — SBC Backend Entry Point
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const rateLimit = require("express-rate-limit");

// Load environment variables from .env file
dotenv.config();

const app = express();

// ── Rate Limiting (protect from abuse) ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // limit each IP to 100 requests per window
  message: { message: "Too many requests, please try again later." }
});
app.use("/api/", limiter);

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded images statically ──
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Connect to MongoDB Atlas ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ── Import Routes ──
const authRoutes     = require("./routes/authRoutes");
const userRoutes     = require("./routes/userRoutes");
const eventRoutes    = require("./routes/eventRoutes");
const postRoutes     = require("./routes/postRoutes");
const galleryRoutes  = require("./routes/galleryRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes    = require("./routes/adminRoutes");
const memberRoutes   = require("./routes/memberRoutes");

// ── Mount Routes ──
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);      // kept for frontend backward-compat
app.use("/api/events",   eventRoutes);
app.use("/api/posts",    postRoutes);
app.use("/api/gallery",  galleryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/member",   memberRoutes);

// ── Health Check ──
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SBC API is running" });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// ── 404 Fallback ──
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SBC Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
});
