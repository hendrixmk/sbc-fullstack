// ============================================================
// js/main.js — Public page scripts (index, blogs, gallery)
// ============================================================

const API_URL = "http://localhost:5000";

// ── Fetch and render blog posts on blogs.html ──
async function loadBlogs() {
  const container = document.getElementById("blog-container");
  if (!container) return;

  container.innerHTML = `<p class="loading-text">Loading blogs...</p>`;

  try {
    const res = await fetch(API_URL + "/api/posts");
    const blogs = await res.json();

    container.innerHTML = "";

    if (!blogs.length) {
      container.innerHTML = `<p style="color:#9ca3af;">No blogs published yet.</p>`;
      return;
    }

    blogs.forEach(blog => {
      const div = document.createElement("div");
      div.className = "blog-card";
      div.innerHTML = `
        ${blog.imageUrl ? `<img src="${blog.imageUrl}" alt="Blog image" class="blog-card-image">` : ""}
        <div class="blog-card-body">
          <h3 class="blog-card-title">${blog.title}</h3>
          <p class="blog-card-excerpt">${blog.content.substring(0, 200)}${blog.content.length > 200 ? "..." : ""}</p>
          <div class="blog-card-meta">
            <span>✍️ ${blog.authorName}</span>
            <span>${new Date(blog.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
          </div>
        </div>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    container.innerHTML = `<p style="color:#ef4444;">Failed to load blogs. Please try again later.</p>`;
  }
}

// ── Fetch and render gallery on blogs.html ──
async function loadGallery() {
  const container = document.getElementById("gallery-container");
  if (!container) return;

  try {
    const res = await fetch(API_URL + "/api/gallery");
    const images = await res.json();

    container.innerHTML = "";

    if (!images.length) {
      container.innerHTML = `<p style="color:#9ca3af;">No gallery images yet.</p>`;
      return;
    }

    images.forEach(img => {
      const div = document.createElement("div");
      div.className = "gallery-item";
      div.innerHTML = `
        <img src="${img.imageUrl}" alt="${img.caption || 'Gallery image'}" loading="lazy">
        ${img.caption ? `<p class="gallery-caption">${img.caption}</p>` : ""}
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Gallery load error:", err);
  }
}

// ── Load events on index.html ──
async function loadEvents() {
  const container = document.getElementById("events-container");
  if (!container) return;

  try {
    const res = await fetch(API_URL + "/api/events");
    const events = await res.json();

    const now = new Date();
    const upcoming = events.filter(e => new Date(e.date) > now);

    if (upcoming.length > 0) startCountdown(upcoming[0]);

    container.innerHTML = "";

    if (!events.length) {
      container.innerHTML = `<p style="color:#9ca3af;">No upcoming events.</p>`;
      return;
    }

    events.forEach(event => {
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="event-card">
          <div class="event-date">
            <span class="day">${new Date(event.date).getDate()}</span>
            <span class="month">${new Date(event.date).toLocaleString("default", { month: "short" })}</span>
          </div>
          <div class="event-content">
            <h3>${event.title}</h3>
            <p class="collapsed">${event.description}</p>
            <span class="read-more">Read more</span>
          </div>
        </div>
      `;

      container.appendChild(div);

      const readMore = div.querySelector(".read-more");
      const para     = div.querySelector("p");

      setTimeout(() => {
        if (para.scrollHeight <= para.clientHeight) readMore.style.display = "none";
      }, 0);

      readMore.addEventListener("click", () => {
        para.classList.toggle("collapsed");
        readMore.innerText = para.classList.contains("collapsed") ? "Read more" : "Show less";
      });
    });

  } catch (err) {
    console.error("Events load error:", err);
  }
}

// ── Countdown Timer ──
function startCountdown(nextEvent) {
  const container = document.getElementById("next-event-countdown");
  if (!container) return;

  const eventDate = new Date(nextEvent.date).getTime();

  container.innerHTML = `
    <div class="countdown-title">Upcoming Event: ${nextEvent.title}</div>
    <div class="countdown" id="countdown-timer"></div>
  `;

  const timer = document.getElementById("countdown-timer");

  function updateCountdown() {
    const distance = eventDate - new Date().getTime();
    if (distance <= 0) {
      timer.innerHTML = "<strong>Event is happening now!</strong>";
      clearInterval(interval);
      return;
    }
    const days    = Math.floor(distance / 86400000);
    const hours   = Math.floor((distance / 3600000) % 24);
    const minutes = Math.floor((distance / 60000) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    timer.innerHTML = `
      <div class="countdown-box"><span class="countdown-number">${days}</span><span class="countdown-label">Days</span></div>
      <div class="countdown-box"><span class="countdown-number">${hours}</span><span class="countdown-label">Hours</span></div>
      <div class="countdown-box"><span class="countdown-number">${minutes}</span><span class="countdown-label">Minutes</span></div>
      <div class="countdown-box"><span class="countdown-number">${seconds}</span><span class="countdown-label">Seconds</span></div>
    `;
  }

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
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

// ── Init ──
document.addEventListener("DOMContentLoaded", () => {
  loadBlogs();
  loadGallery();
  loadEvents();
});
