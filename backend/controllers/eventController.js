// ============================================================
// controllers/eventController.js — Public Event Endpoints
// ============================================================

const Event = require("../models/Event");

// GET /api/events — Get all events (public, used on homepage)
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // ascending by date
    const mapped = events.map(e => ({
      id: e._id,
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

module.exports = { getEvents };
