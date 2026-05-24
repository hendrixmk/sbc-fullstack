// ============================================================
// models/Feedback.js — Feedback / Contact Form Model
// ============================================================

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true
    },
    message: {
      type: String,
      required: [true, "Message is required"]
    },
    // Has the admin read/reviewed this feedback?
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
