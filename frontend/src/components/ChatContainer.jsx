import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView();
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100/10">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((message) => {
          const isSender = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              className={`chat ${isSender ? "chat-end" : "chat-start"} animate-fade-in-up`}
              ref={messageEndRef}
            >
              {/* Profile Avatar */}
              <div className="chat-image avatar">
                <div className="size-9 rounded-full border border-base-content/10 shadow-sm">
                  <img
                    src={
                      isSender
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="object-cover size-full"
                  />
                </div>
              </div>
              
              {/* Message Timestamp header */}
              <div className="chat-header mb-1 opacity-50 text-[10px] tracking-wider font-semibold">
                <time className="mx-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Chat Bubble with dynamic tails/shapes */}
              <div 
                className={`chat-bubble flex flex-col gap-1.5 p-3.5 text-sm shadow-sm ${
                  isSender
                    ? "bg-primary text-primary-content rounded-2xl rounded-tr-none shadow-sm"
                    : "bg-base-200 text-base-content rounded-2xl rounded-tl-none border border-base-content/5"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="max-w-[260px] rounded-xl mb-1 shadow-sm border border-base-content/10 object-cover"
                  />
                )}
                {message.text && <p className="leading-relaxed">{message.text}</p>}
              </div>

              {/* Read Receipt Ticks — only shown on messages sent by the logged-in user */}
              {isSender && (
                <div className="chat-footer mt-0.5">
                  <span
                    className={`text-[11px] font-bold tracking-tight select-none transition-colors duration-300 ${
                      message.isRead ? "text-blue-400" : "opacity-40"
                    }`}
                    title={message.isRead ? "Read" : "Sent"}
                  >
                    ✓✓
                  </span>
                </div>
              )}
            </div>
          );
        })}

      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;