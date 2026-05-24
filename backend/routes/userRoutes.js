// ============================================================
// routes/userRoutes.js
// Kept for backward compatibility with existing frontend
// which calls /api/users/login and /api/users/register
// ============================================================

const express = require("express");
const router  = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// These match the URLs already in the existing frontend HTML files
router.post("/register", registerUser);
router.post("/login",    loginUser);

module.exports = router;
