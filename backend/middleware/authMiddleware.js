// ============================================================
// middleware/authMiddleware.js — JWT Authentication & Role Guards
// ============================================================

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Protect Route: verify JWT token ──
// Use this on any route that requires login
const protect = async (req, res, next) => {
  let token;

  // JWT is sent as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract just the token part (remove "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Verify and decode the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to req.user (exclude password from result)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next(); // token is valid — continue to the route handler

    } catch (err) {
      // Token is expired, tampered, or invalid
      return res.status(401).json({ message: "Not authorized — invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }
};

// ── Admin Guard: only admins can access ──
// Must be used AFTER protect middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied — admins only" });
  }
};

// ── Approved Member Guard: must be approved to proceed ──
const approvedOnly = (req, res, next) => {
  if (req.user && (req.user.approved || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({
      message: "Your account is pending approval by the admin"
    });
  }
};

module.exports = { protect, adminOnly, approvedOnly };
