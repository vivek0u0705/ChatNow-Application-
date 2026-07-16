import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null); // debounce timer for stopTyping
  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    // Stop typing indicator immediately on send
    if (socket && selectedUser) {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }
    clearTimeout(typingTimeoutRef.current);

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Emit typing / stopTyping events with a 2-second debounce
  const handleTyping = (e) => {
    setText(e.target.value);

    if (!socket || !selectedUser) return;

    socket.emit("typing", { receiverId: selectedUser._id });

    // Reset the debounce timer on every keystroke
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 2000);
  };

  return (
    <div className="p-4 w-full bg-base-100/30 border-t border-base-content/5 backdrop-blur-sm">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-base-content/10 shadow-md transition-all group-hover:brightness-95"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-base-content text-base-100 border border-base-100/10 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150"
              type="button"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex gap-2 relative">
          
          {/* Main Input Textbox */}
          <input
            type="text"
            className="w-full input input-bordered rounded-full pr-12 input-premium focus:outline-none"
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Trigger Button */}
          <button
            type="button"
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm hover:bg-base-content/10 transition-all duration-200
                     ${imagePreview ? "text-success" : "text-base-content/40 hover:text-primary"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={18} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className={`btn btn-circle shadow-md transition-all duration-200 active:scale-[0.93] ${
            text.trim() || imagePreview
              ? "btn-primary text-primary-content shadow-primary/20 hover:scale-105"
              : "btn-ghost border border-base-content/5 bg-base-content/5 opacity-40 cursor-not-allowed"
          }`}
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} className="translate-x-[0.5px]" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;