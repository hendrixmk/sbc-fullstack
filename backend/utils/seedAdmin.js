// ============================================================
// utils/seedAdmin.js — Creates the first admin account
// Run once: node utils/seedAdmin.js
// ============================================================
require('dotenv').config();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config({ path: "../.env" });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Check if admin already exists
    const existing = await User.findOne({ role: "admin" });
    if (existing) {
      console.log("✅ Admin already exists:", existing.email);
      process.exit(0);
    }

    // Create admin — change these credentials before running!
    const admin = await User.create({
      name:     "Church Admin",
      email:    "admin@singgimari.church",
      password: "Admin@SBC2026",   // CHANGE THIS!
      role:     "admin",
      approved: true
    });

    console.log("✅ Admin created successfully!");
    console.log("   Email:   ", admin.email);
    console.log("   Password: Admin@SBC2026  ← Change this after first login!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
