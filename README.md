Singgimari Baptist Church — Web App

A website for Singgimari Baptist Church (Selsella, West Garo Hills, Meghalaya), built as a full-stack project with a real backend instead of a static site.

Members can sign up, write blog posts, and upload photos to a gallery — once an admin approves them. Admins manage members, events, posts, and feedback from a dashboard. Everyone else just sees the public site: homepage, blog, gallery, and events.

Stack


Backend: Node.js, Express, MongoDB (Atlas), Mongoose
Auth: JWT, with bcrypt for password hashing
Images: Cloudinary, uploaded via Multer
Frontend: Plain HTML, CSS, and JavaScript — no framework, no build step


Structure

backend/    Express API — routes, controllers, models, middleware
frontend/   Static pages — homepage, blogs, dashboards, login/register

Routes are split by who can use them: public (events, posts, gallery, feedback), member (profile, write posts, upload photos), and admin (approve members, manage everything).

How it works

A new member registers but isn't approved yet. An admin approves them from the dashboard, and from there they can log in, post, and upload images. Anything a member submits — a post or a gallery photo — also needs admin approval before it shows up publicly.


Built for Singgimari Baptist Church.
