import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ── TYPING INDICATOR ──────────────────────────────────────────────────────
  // Pure relay: server forwards typing events to the receiver's socket.
  // Typing status is transient — NOT stored in the database.
  // The frontend sets a 2s debounce timeout before emitting stopTyping.

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", userId);
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", userId);
    }
  });

  // ─────────────────────────────────────────────────────────────────────────

  socket.on("markMessageAsRead", async ({ messageId, senderId }) => {
    try {
      await Message.updateOne({ _id: messageId }, { $set: { isRead: true } });
      const senderSocketId = userSocketMap[senderId];
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", [messageId]);
      }
    } catch (error) {
      console.log("Error marking message as read via socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    // Only delete if the disconnecting socket is the currently active one
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };