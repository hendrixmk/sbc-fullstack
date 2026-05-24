// ============================================================
// controllers/feedbackController.js — Feedback Submission
// ============================================================

const Feedback = require("../models/Feedback");

// POST /api/feedback — Submit feedback (public, no login required)
const submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({ name, email, message });
    res.status(201).json({ message: "Thank you for your feedback!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};

module.exports = { submitFeedback };
