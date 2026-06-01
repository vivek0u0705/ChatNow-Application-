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

## 🏗️ Project Architecture & Implementation Details

ChatNow is designed with a decoupled architecture, separating the client-side rendering from the server-side logic and real-time socket connections.

### 1. Authentication Flow
- **Traditional Auth**: Users can sign up with an email and password. Passwords are encrypted using `bcryptjs`. Upon successful login, the server issues a JSON Web Token (JWT) which is stored in a secure, HTTP-only cookie. This prevents Cross-Site Scripting (XSS) attacks.
- **Google OAuth**: Users can log in using their Google account via the `@react-oauth/google` library. The frontend receives a Google ID Token and sends it to the backend. The backend verifies the token using `google-auth-library` and either finds the existing user or creates a new one (assigning a strong randomized fallback password) before issuing the JWT cookie.

### 2. Real-Time Messaging (Socket.io)
- When a user logs in, the `useAuthStore` triggers a Socket.io connection, passing the `userId` in the handshake query.
- The backend maps this `userId` to the specific socket ID, keeping track of online users in memory.
- When a message is sent, it is saved to MongoDB. The backend then checks if the recipient is online; if so, it instantly emits a `newMessage` event directly to their specific socket ID, enabling real-time delivery without polling.

### 3. State Management (Zustand)
The frontend completely relies on Zustand for global state management, split into specific domain stores:
- **`useAuthStore`**: Manages the authenticated user data, socket connection instance, and lists of online users.
- **`useChatStore`**: Manages the selected chat user, fetches message histories, sends messages, and subscribes to real-time socket events for new incoming messages.
- **`useThemeStore`**: Dynamically controls the UI theme by injecting DaisyUI theme strings into the HTML document attributes.

### 4. Database Schema (MongoDB & Mongoose)
- **User Model**: Stores `fullName`, `email`, `password`, and a `profilePic` URL (hosted on Cloudinary).
- **Message Model**: Stores `senderId`, `receiverId`, `text` (optional), `image` (optional), and timestamps. This structure allows efficient indexing and querying of message histories between any two users.

## 💻 Local Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (for DB URI)
- Cloudinary account (for image uploads)
- Google Cloud Console account (for OAuth)

### Steps
1. **Clone the repository**
   ```bash
   git clone https://github.com/vivek0u0705/ChatNow-Application-.git
   cd ChatNow-Application-
   ```
2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```
3. **Environment Variables Setup**
   - In the `backend/` folder, create a `.env` file:
     ```env
     MONGODB_URI=your_mongo_uri
     PORT=5001
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     NODE_ENV=development
     GOOGLE_CLIENT_ID=your_google_client_id
     ```
   - In the `frontend/` folder, create a `.env.local` file:
     ```env
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```
4. **Run the Development Servers**
   - Start the backend (from the `backend/` directory):
     ```bash
     npm run dev
     ```
   - Start the frontend (from the `frontend/` directory):
     ```bash
     npm run dev
     ```
5. **Open the app** in your browser at `http://localhost:5173`.
## 🚀 Deployment Instructions

To successfully deploy this application, you must configure Google OAuth, host the backend on Render, and host the frontend on Vercel. Because they are hosted on different domains, they must be properly linked via environment variables.

### Step 1: Set up Google OAuth (Cloud Console)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g., "ChatNow App").
3. Navigate to **APIs & Services > OAuth consent screen**. Choose **External** and fill out the required App name and Support email fields.
4. Navigate to **Credentials**, click **Create Credentials**, and select **OAuth client ID**.
5. Choose **Web application** as the Application type.
6. Under **Authorized JavaScript origins**, add your development and production frontend URLs (e.g., `http://localhost:5173` and `https://your-frontend.vercel.app`). **Important:** Ensure there is no trailing slash (/) at the end of these URLs.
7. Click **Create** and copy your **Client ID**. You will need this for both the frontend and backend.

### Step 2: Deploy Backend (Render)
1. Sign in to [Render](https://render.com) and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the service with the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Expand the **Advanced** section and click **Add Environment Variable**. Add the following:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A strong, random string for JWT encryption.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials from your Cloudinary dashboard.
   - `GOOGLE_CLIENT_ID`: The Client ID you got from Step 1.
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: The URL where your Vercel frontend will live (e.g., `https://chatnow-frontend.vercel.app`). *You can leave this blank for now and update it in Step 4.*
5. Click **Create Web Service**. Wait for it to deploy and copy the backend URL (e.g., `https://chatnow-api.onrender.com`).

### Step 3: Deploy Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure the project with the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. Expand the **Environment Variables** section and add:
   - `VITE_GOOGLE_CLIENT_ID`: The Client ID you got from Step 1.
   - `VITE_BACKEND_URL`: The deployed URL of your Render backend from Step 2 (e.g., `https://chatnow-api.onrender.com`).
5. Click **Deploy**. Once finished, copy your new Vercel domain (e.g., `https://chatnow-frontend.vercel.app`).

### Step 4: Final Linking (Crucial)
1. Go back to your **Render Backend Settings > Environment**. Add or update the `FRONTEND_URL` variable to exactly match your Vercel domain (e.g., `https://chatnow-frontend.vercel.app`). This is required so the backend allows CORS requests from your frontend.
2. Go back to your **Google Cloud Console > Credentials**. Ensure that your final Vercel domain is added to the **Authorized JavaScript origins**. Without this, Google Login will throw a "400 origin_mismatch" error in production.

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
