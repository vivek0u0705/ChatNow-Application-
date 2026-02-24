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

// ✅ VERY IMPORTANT — Increase JSON limit for base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Error Handler
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

// Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}

// Start Server
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});