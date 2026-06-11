# ChatNow 💬

A production-ready, real-time MERN stack chat application. Built with a decoupled architecture to demonstrate scalable authentication and real-time WebSockets.

**Tech Stack:** React (Zustand, Tailwind), Node.js (Express), MongoDB, Socket.io, Cloudinary.

---

## 🏗️ Architecture & Interview Guide

### 1. Stateless Authentication (Bearer Tokens)
*We bypass third-party cookie restrictions by using stateless token headers.*
- **Flow:** User authenticates (Google OAuth or Email) ➔ Backend signs a JWT ➔ Token is returned in JSON payload ➔ Frontend `Zustand` store saves token to `localStorage`.
- **API Security:** An `Axios Interceptor` automatically attaches `Authorization: Bearer <token>` to every outgoing request.

### 2. Real-Time WebSockets (Socket.io)
*We use bi-directional event emission instead of database polling.*
- **Connection:** Upon login, the client connects to `Socket.io`, passing its `userId` in the handshake query.
- **Tracking:** The backend maps `userId` ➔ `socket.id` in a memory hash map and broadcasts `getOnlineUsers`.
- **Direct Messaging:** When a message is sent, it saves to MongoDB. The server checks the hash map; if the recipient is online, it instantly emits a `newMessage` event directly to their specific `socket.id`.

### 3. Cloud Media (Cloudinary)
*We avoid local file storage for ephemeral server compatibility.*
- **Flow:** User selects an image ➔ Frontend converts it to a `Base64` string ➔ Sends to API ➔ Backend securely uploads to Cloudinary ➔ Returns the permanent CDN `secure_url` to save in MongoDB.

---

## 🚀 Deployment (Split-Architecture)
- **Frontend (Vercel):** Hosts the static React build for global CDN edge delivery.
- **Backend (Render):** Hosts the Node API and WebSocket server.
- *Note:* Google Cloud Console's OAuth must authorize the exact Vercel production URL.

---

## 💻 Local Setup

```bash
# 1. Clone & Install
git clone https://github.com/vivek0u0705/ChatNow-Application-.git
cd ChatNow-Application-
cd backend && npm install
cd ../frontend && npm install

# 2. Add Environment Variables (.env)
# backend/.env requires: MONGODB_URI, JWT_SECRET, CLOUDINARY credentials, GOOGLE_CLIENT_ID
# frontend/.env.local requires: VITE_GOOGLE_CLIENT_ID

# 3. Run Development Servers
cd backend && npm run dev
cd ../frontend && npm run dev
```
