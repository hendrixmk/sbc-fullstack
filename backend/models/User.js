// ============================================================
// models/User.js — Church Member / Admin User Model
// ============================================================

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // ── Basic Info ──
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false // never returned in queries by default
    },

    // ── Role & Access ──
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member"
    },
    approved: {
      type: Boolean,
      default: false   // admin must approve before member can log in
    },

    // ── Profile ──
    profilePicture: {
      type: String,
      default: ""       // Cloudinary URL
    },
    designation: {
      type: String,
      default: "",      // e.g. "Youth Director", "Deacon"
      trim: true
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500
    },
    phone: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true  // adds createdAt and updatedAt automatically
  }
);

// ── Hash password before saving ──
// This runs every time a user document is saved/updated
userSchema.pre("save", async function (next) {
  // Only hash if the password field was actually changed
  if (!this.isModified("password")) return next();

  // Salt rounds = 10 is a good balance of security vs speed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare entered password with hashed password ──
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
