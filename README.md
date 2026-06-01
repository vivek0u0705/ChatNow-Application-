# ChatNow 💬

A real-time chat application built using the MERN stack.

## 🚀 Features

- Real-time messaging with Socket.io
- User authentication (JWT + Cookies)
- Modern responsive UI with Tailwind + DaisyUI
- Multiple theme support
- Image upload with Cloudinary
- Google OAuth Login/Signup
- Frontend deployed on Vercel, Backend deployed on Render

## 🚀 Deployment Instructions

### Backend (Render)
1. Create a new Web Service on Render and link your GitHub repo.
2. Set the Root Directory to `backend`.
3. Set the Build Command to `npm install`.
4. Set the Start Command to `npm start`.
5. Add all your backend `.env` variables.
6. Add `FRONTEND_URL` environment variable pointing to your Vercel domain (e.g., `https://your-frontend.vercel.app`).

### Frontend (Vercel)
1. Create a new Project on Vercel and link your GitHub repo.
2. Set the Framework Preset to `Vite`.
3. Set the Root Directory to `frontend`.
4. Add your `.env.local` variables.
5. Add `VITE_BACKEND_URL` environment variable pointing to your Render domain (e.g., `https://your-backend.onrender.com`).

## 🛠️ Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- DaisyUI
- Zustand

Backend:
- Node.js
- Express
- MongoDB
- Socket.io
