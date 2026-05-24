// ============================================================
// js/config.js — Shared Configuration & Helper Functions
// Used by all dashboard and auth pages
// ============================================================

// ── Backend API base URL ──
// Change this when deploying: update to your Render backend URL
const API_URL = "http://localhost:5000";

// ── Auth helpers ──
const getToken  = () => localStorage.getItem("token");
const getRole   = () => localStorage.getItem("role");
const getUserName = () => localStorage.getItem("userName") || "Member";

// ── Redirect if not logged in ──
function requireAuth(role = null) {
  const token = getToken();
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  if (role && getRole() !== role) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// ── Logout ──
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// ── Standard API fetch wrapper ──
// Automatically adds Authorization header
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": "Bearer " + token } : {}),
    ...(options.headers || {})
  };

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const res = await fetch(API_URL + endpoint, {
    ...options,
    headers
  });

  return res;
}

// ── Toast notification ──
function showToast(message, type = "default") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = "toast " + type;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Set button loading state ──
function setLoading(btn, loading, text = "") {
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner"></span> ${text || "Loading..."}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || text;
  }
}

// ── Format date nicely ──
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ── Toggle mega menu ──
function toggleMenu() {
  const btn  = document.querySelector(".menu-btn");
  const menu = document.getElementById("navMenu");
  if (!btn || !menu) return;
  btn.classList.toggle("active");
  menu.classList.toggle("show");
  btn.setAttribute("aria-expanded", btn.classList.contains("active"));
}
