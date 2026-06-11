import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/10 flex flex-col transition-all duration-200 bg-base-100/30 backdrop-blur-sm">
      <div className="border-b border-base-content/10 w-full p-5">
        <div className="flex items-center gap-2 text-primary">
          <Users className="size-5" />
          <span className="font-semibold hidden lg:block tracking-wide">Contacts</span>
        </div>
        
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2.5 group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-primary checkbox-sm rounded-md transition-all duration-200"
            />
            <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">Show online only</span>
          </label>
          <span className="text-xs opacity-40">({Math.max(0, onlineUsers.length - 1)} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3 custom-scrollbar flex-1 space-y-1">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-[calc(100%-1rem)] mx-2 p-3 flex items-center gap-3
              rounded-xl transition-all duration-200
              ${selectedUser?._id === user._id 
                ? "bg-primary/10 text-primary border-l-4 border-primary shadow-sm" 
                : "hover:bg-base-content/5 border-l-4 border-transparent text-base-content"
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-11 object-cover rounded-full border border-base-content/10 shadow-sm"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-semibold truncate text-sm">{user.fullName}</div>
              <div className="text-xs opacity-60">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center opacity-50 py-8 text-sm">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;