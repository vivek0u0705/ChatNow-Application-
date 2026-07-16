import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    
    // 1. Get all users except current user
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // 2. Find the most recent message timestamp for each conversation
    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: loggedInUserId },
            { receiverId: loggedInUserId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderId", loggedInUserId] },
              then: "$receiverId",
              else: "$senderId"
            }
          },
          lastMessageTime: { $first: "$createdAt" }
        }
      }
    ]);

    // 3. Attach the last message time and sort
    const userList = users.map(user => {
      const lastMsg = lastMessages.find(m => m._id.toString() === user._id.toString());
      return {
        ...user.toObject(),
        lastMessageTime: lastMsg ? lastMsg.lastMessageTime : new Date(0)
      };
    });

    userList.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    res.status(200).json(userList);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);
      
    // Reverse them so they display chronologically in the UI (oldest at top, newest at bottom)
    messages.reverse();


    // ── READ RECEIPTS ──────────────────────────────────────────────────────
    // Mark all unread messages FROM the other user TO me as read.
    // This runs when the receiver opens the chat — same moment they see msgs.
    const unreadMessageIds = messages
      .filter((m) => m.senderId.toString() === userToChatId && !m.isRead)
      .map((m) => m._id);

    if (unreadMessageIds.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessageIds } },
        { $set: { isRead: true } }
      );

      // Notify the sender in real time so their ✓✓ ticks turn blue instantly
      const senderSocketId = getReceiverSocketId(userToChatId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", unreadMessageIds);
      }
    }
    // ──────────────────────────────────────────────────────────────────────

    // Reflect the isRead update in the response so the receiver also gets
    // accurate isRead values without a second round-trip to the DB.
    const readIdSet = new Set(unreadMessageIds.map(String));
    const updatedMessages = messages.map((m) =>
      readIdSet.has(String(m._id)) ? { ...m.toObject(), isRead: true } : m
    );

    res.status(200).json(updatedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};