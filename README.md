# Singgimari Baptist Church — Full-Stack Web Application

A complete church website with **Node.js + Express + MongoDB Atlas** backend, **JWT authentication**, **Cloudinary** image uploads, and an improved responsive frontend.

---

## 📁 Project Structure

```
sbc-project/
│
├── backend/                     ← Node.js + Express API
│   ├── config/
│   │   ├── db.js                ← MongoDB Atlas connection
│   │   └── cloudinary.js        ← Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── authController.js    ← Register, Login, getMe
│   │   ├── adminController.js   ← All admin dashboard operations
│   │   ├── memberController.js  ← Member profile, posts, gallery
│   │   ├── eventController.js   ← Public events
│   │   ├── postController.js    ← Public approved posts
│   │   ├── galleryController.js ← Public approved gallery
│   │   └── feedbackController.js← Public feedback submission
│   ├── middleware/
│   │   └── authMiddleware.js    ← protect, adminOnly, approvedOnly
│   ├── models/
│   │   ├── User.js              ← Member/Admin schema
│   │   ├── Event.js             ← Church event schema
│   │   ├── Post.js              ← Blog post schema
│   │   ├── Gallery.js           ← Gallery image schema
│   │   └── Feedback.js          ← Feedback/contact schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js        ← backward compat (/api/users/*)
│   │   ├── adminRoutes.js
│   │   ├── memberRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── postRoutes.js
│   │   ├── galleryRoutes.js
│   │   └── feedbackRoutes.js
│   ├── utils/
│   │   └── seedAdmin.js         ← Create first admin account
│   ├── .env.example             ← Copy to .env and fill in values
│   ├── .gitignore
│   ├── package.json
│   └── server.js                ← App entry point
│
└── frontend/                    ← Static HTML/CSS/JS
    ├── css/
    │   ├── style.css
    │   ├── header.css
    │   ├── dashboard.css        ← Improved dashboard styles
    │   ├── events.css
    │   ├── write.css
    │   └── mission.css
    ├── js/
    │   ├── config.js            ← API_URL + shared helpers
    │   └── main.js              ← Public page scripts
    ├── images/                  ← Static image assets
    ├── departments/             ← Department HTML pages
    ├── index.html               ← Homepage
    ├── login.html               ← Login page
    ├── register.html            ← Registration page
    ├── blogs.html               ← Public blogs & gallery
    ├── write.html               ← Redirect to dashboard
    ├── admin.html               ← Admin dashboard
    └── member-dashboard.html   ← Member dashboard
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **MongoDB Atlas** account — [mongodb.com/atlas](https://mongodb.com/atlas) (free tier works great)
- **Cloudinary** account — [cloudinary.com](https://cloudinary.com) (free tier works)
- A code editor (VS Code recommended)

---

## 🚀 Backend Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Then open `.env` and fill in all values:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sbc?retryWrites=true&w=majority

# JWT secret — generate a strong random string:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_very_long_random_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary credentials (from your Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL for CORS (change in production)
FRONTEND_URL=http://localhost:3000
```

### 3. Getting MongoDB Atlas URI

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Click **Connect** → **Drivers** → **Node.js**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with `sbc`

### 4. Getting Cloudinary credentials

1. Go to [cloudinary.com](https://cloudinary.com) and sign up free
2. From your Dashboard, copy: **Cloud Name**, **API Key**, **API Secret**
3. Paste them into `.env`

### 5. Create the first Admin account

```bash
node utils/seedAdmin.js
```

Output:
```
✅ Admin created successfully!
   Email:    admin@singgimari.church
   Password: Admin@SBC2026  ← Change this after first login!
```

> ⚠️ **Important:** Change the admin password after your first login by editing `utils/seedAdmin.js` before running it, or by updating it directly in MongoDB Atlas.

### 6. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

Test it: `http://localhost:5000/api/health` → `{"status":"ok","message":"SBC API is running"}`

---

## 🌐 Frontend Setup

The frontend is **pure HTML/CSS/JS** — no build step required.

### Update the API URL

Open `frontend/js/config.js` and `frontend/js/main.js`, update:

```javascript
const API_URL = "http://localhost:5000"; // development
// OR for production:
const API_URL = "https://your-backend.onrender.com";
```

Also update the `API_URL` const in these files individually:
- `frontend/login.html`
- `frontend/register.html`
- `frontend/admin.html`
- `frontend/member-dashboard.html`

### Serve locally

Use any static file server:

```bash
# Option 1: VS Code Live Server extension (easiest)
# Right-click index.html → "Open with Live Server"

# Option 2: Python
cd frontend
python -m http.server 3000

# Option 3: Node.js serve
npx serve frontend -p 3000
```

---

## 📋 API Reference

### Public Endpoints (no login required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new member |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/events` | Get all events |
| GET | `/api/posts` | Get approved blog posts |
| GET | `/api/gallery` | Get approved gallery images |
| POST | `/api/feedback` | Submit feedback message |

### Member Endpoints (JWT required + admin approved)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/member/profile` | Get own profile |
| PUT | `/api/member/profile` | Update name, bio, designation |
| PUT | `/api/member/profile/picture` | Upload profile picture |
| PUT | `/api/member/change-password` | Change password |
| POST | `/api/member/posts` | Submit blog post (with image) |
| GET | `/api/member/posts` | Get own posts |
| POST | `/api/member/gallery` | Upload gallery image |
| GET | `/api/member/gallery` | Get own gallery images |

### Admin Endpoints (JWT + admin role required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/users` | List all members |
| PUT | `/api/admin/users/:id/approve` | Approve a member |
| DELETE | `/api/admin/users/:id` | Remove a member |
| POST | `/api/admin/events` | Create event |
| DELETE | `/api/admin/events/:id` | Delete event |
| GET | `/api/admin/posts` | All posts |
| PUT | `/api/admin/posts/:id/approve` | Approve post |
| DELETE | `/api/admin/posts/:id` | Delete post |
| GET | `/api/admin/gallery` | All gallery images |
| PUT | `/api/admin/gallery/:id/approve` | Approve image |
| DELETE | `/api/admin/gallery/:id` | Delete image |
| GET | `/api/admin/feedback` | All feedback |
| PUT | `/api/admin/feedback/:id/read` | Mark feedback as read |
| DELETE | `/api/admin/feedback/:id` | Delete feedback |

---

## 🚢 Deploying to Render (Free Tier)

### Deploy the Backend

1. Push your `backend/` folder to a GitHub repository
2. Go to [render.com](https://render.com) → **New** → **Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `sbc-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
5. Under **Environment Variables**, add all your `.env` values
6. Click **Create Web Service**
7. Copy your Render URL: `https://sbc-backend-xxxx.onrender.com`

### Deploy the Frontend

1. Update **all** `API_URL` values in the frontend to your Render backend URL
2. Go to Render → **New** → **Static Site**
3. Connect your repo
4. **Root Directory:** `frontend`
5. **Publish Directory:** `.` (or `frontend`)
6. Click **Create Static Site**

> 💡 **Tip:** You can also deploy the frontend for free on [Netlify](https://netlify.com) or [GitHub Pages](https://pages.github.com).

---

## 🔐 How Authentication Works

1. **Member registers** → account created with `approved: false`
2. **Admin logs in** → sees pending members in dashboard
3. **Admin approves member** → `approved: true`
4. **Member logs in** → server checks: valid password + approved = ✅ → returns JWT token
5. **Frontend stores** token in `localStorage`
6. **Every API request** sends `Authorization: Bearer <token>` header
7. **`protect` middleware** verifies token → attaches user to `req.user`
8. **`adminOnly` middleware** checks `req.user.role === 'admin'`

---

## 🖼️ How Image Uploads Work

1. Member selects image in form
2. Frontend sends `FormData` (multipart) to API
3. **Multer** middleware intercepts the file
4. **multer-storage-cloudinary** streams it directly to Cloudinary
5. Cloudinary returns a URL → saved in MongoDB
6. Image is never stored on the server disk

---

## ✅ Features Summary

### Admin Dashboard
- 📊 Live statistics (members, posts, feedback counts)
- 👥 Approve/remove members
- 📅 Create and delete events
- 📝 Review, approve, or delete member blog posts
- 🖼️ Review and approve gallery images
- 💬 Read and manage feedback messages

### Member Dashboard
- ✍️ Write and submit blog posts with images
- 📸 Upload gallery images with captions
- 👤 Edit profile (name, designation, bio, phone)
- 🖼️ Change profile picture (Cloudinary upload)
- 🔒 Change password
- 📅 View upcoming church events
- 💬 Submit feedback to admin

### Public Website
- 🏠 Homepage with church info, beliefs, history
- 📖 Public blog feed (approved posts only)
- 🖼️ Public photo gallery (approved only)
- ⏱️ Countdown to next upcoming event
- 📍 Google Maps embed

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Runtime | Node.js v18+ |
| HTTP Framework | Express.js 4 |
| Database | MongoDB Atlas (cloud) |
| ODM | Mongoose 8 |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| File Uploads | Multer + multer-storage-cloudinary |
| Image CDN | Cloudinary |
| Security | express-rate-limit, CORS |
| Frontend | Vanilla HTML5 / CSS3 / JS (ES6+) |
| Deployment | Render (backend) + Render/Netlify (frontend) |

---

## 🐛 Troubleshooting

**"Could not connect to server"**
→ Check that your backend is running and `API_URL` in the frontend matches.

**"Not authorized — no token provided"**
→ You're not logged in or token expired. Log in again.

**"Your account is pending approval"**
→ Admin needs to approve your member account first.

**MongoDB connection fails**
→ Check your Atlas IP whitelist. Add `0.0.0.0/0` in Atlas → Network Access to allow all IPs (fine for development).

**Images not uploading**
→ Check your Cloudinary credentials in `.env`. Make sure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are all correct.

**Render backend sleeping**
→ Free tier Render services sleep after 15 minutes of inactivity. First request may take ~30 seconds to wake up. Consider using [UptimeRobot](https://uptimerobot.com) to ping it every 14 minutes.

---

## 📞 Support

For questions or issues, contact: **singgimaribaptist@gmail.com**

---

*Built with ❤️ for Singgimari Baptist Church, Selsella, West Garo Hills, Meghalaya*
