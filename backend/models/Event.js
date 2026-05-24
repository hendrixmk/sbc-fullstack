// ============================================================
// models/Event.js — Church Event Model
// ============================================================

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Event description is required"]
    },
    date: {
      type: Date,
      required: [true, "Event date is required"]
    },
    location: {
      type: String,
      default: "Singgimari Baptist Church"
    },
    // Which admin created this event
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);
