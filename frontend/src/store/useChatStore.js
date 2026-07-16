import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const currentSelectedUser = get().selectedUser;
      if (!currentSelectedUser) return;
      const isMessageSentFromSelectedUser = newMessage.senderId === currentSelectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      
      // If we are actively in the chat, mark it as read instantly
      newMessage.isRead = true;
      set({ messages: [...get().messages, newMessage] });
      
      // Notify backend so it updates the DB and the sender's blue ticks
      socket.emit("markMessageAsRead", { 
        messageId: newMessage._id, 
        senderId: newMessage.senderId 
      });
    });

    socket.on("messagesRead", (readMessageIds) => {
      const readIdSet = new Set(readMessageIds.map(String));
      set({
        messages: get().messages.map((m) =>
          readIdSet.has(String(m._id)) ? { ...m, isRead: true } : m
        ),
      });
    });

    socket.on("typing", (senderId) => {
      const currentSelectedUser = get().selectedUser;
      if (currentSelectedUser && senderId === currentSelectedUser._id) {
        set({ isTyping: true });
      }
    });

    socket.on("stopTyping", (senderId) => {
      const currentSelectedUser = get().selectedUser;
      if (currentSelectedUser && senderId === currentSelectedUser._id) {
        set({ isTyping: false });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesRead");
    socket.off("typing");
    socket.off("stopTyping");
    set({ isTyping: false });
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));