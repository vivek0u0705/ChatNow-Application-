import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-3.5 border-b border-base-content/10 bg-base-100/30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          {/* Avatar with dynamic online status badge */}
          <div className="relative">
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName} 
              className="size-10 rounded-full object-cover border border-base-content/10 shadow-sm"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100" />
            )}
          </div>

          {/* User details */}
          <div>
            <h3 className="font-semibold text-sm tracking-wide">{selectedUser.fullName}</h3>
            <p className="text-xs opacity-60 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-base-content/30"}`} />
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close active chat button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="btn btn-sm btn-ghost btn-circle border border-base-content/5 hover:bg-base-content/10 hover:border-transparent transition-all duration-200"
        >
          <X className="size-4 opacity-70" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;