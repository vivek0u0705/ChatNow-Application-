import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    // Tracks whether the receiver has opened and seen this message.
    // Defaults to false (sent). Set to true when receiver calls getMessages.
    // Powers the ✓✓ grey (sent) / ✓✓ blue (read) receipt UI.
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────────────────────────────────────
// INDEX 1: Compound — { senderId, receiverId }
//
// Powers the left arm of the $or in getMessages:
//   { senderId: myId, receiverId: userToChatId }
//
// Without this, MongoDB does a full collection scan on every chat open.
// With this, it jumps directly to the matching document range.
//
// Tradeoff: Slightly slower inserts (one extra index write per message saved).
// In a chat app reads >> writes, so this tradeoff is strongly worthwhile.
// ─────────────────────────────────────────────────────────────────────────────
messageSchema.index({ senderId: 1, receiverId: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// INDEX 2: Compound — { receiverId, senderId }
//
// Powers the right arm of the $or in getMessages:
//   { senderId: userToChatId, receiverId: myId }
//
// MongoDB evaluates each $or clause independently. Without a reverse-direction
// index, the second arm still causes a collection scan even if Index 1 exists.
// Both indexes together let MongoDB resolve the full $or via index only.
//
// Tradeoff: Same as Index 1 — marginal write cost, major read benefit.
// ─────────────────────────────────────────────────────────────────────────────
messageSchema.index({ receiverId: 1, senderId: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// INDEX 3: Single — { createdAt }
//
// Enables efficient time-ordered sorting of messages (e.g. .sort({ createdAt: 1 }))
// without scanning and sorting the entire result set in memory.
//
// Even though sorting is not explicitly called today, adding this index now
// avoids a costly migration later when pagination or message ordering is added.
//
// Tradeoff: Minor storage overhead. No meaningful write performance impact.
// ─────────────────────────────────────────────────────────────────────────────
messageSchema.index({ createdAt: 1 });

// ─────────────────────────────────────────────────────────────────────────────
// INDEX 4: Compound — { receiverId, isRead }
//
// Powers the bulk UPDATE in getMessages:
//   Message.updateMany({ receiverId: myId, senderId: otherId, isRead: false })
//
// Without this, MongoDB scans the whole collection to find unread messages.
// With this, it jumps directly to unread messages for a specific receiver.
//
// Tradeoff: Minor write overhead per message. Read benefit is significant
// in active chats with many unread messages.
// ─────────────────────────────────────────────────────────────────────────────
messageSchema.index({ receiverId: 1, isRead: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;