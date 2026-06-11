import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// ✅ Body parsers (for base64 profile images)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Trust Proxy (Required for secure cookies on Render/Vercel)
app.set("trust proxy", 1);

app.use(cookieParser());

// ✅ CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ================= SERVE FRONTEND =================
if (process.env.NODE_ENV === "production" && !process.env.FRONTEND_URL) {
  // Serve React build files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Handle React Router (all non-API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    console.log("File too large");
    return res
      .status(413)
      .json({ message: "Payload too large. Max size is 10MB." });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ================= START SERVER =================
server.listen(PORT, "0.0.0.0",() => {
  console.log("Server is running on port:", PORT);
  connectDB();
});