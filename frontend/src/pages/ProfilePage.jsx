import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20 pb-10 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-4 z-10 animate-fade-in-up">
        <div className="card glass-panel glass-panel-glow shadow-2xl rounded-3xl p-6 sm:p-8 space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              My Profile
            </h1>
            <p className="text-sm opacity-60">Manage your account information and avatar</p>
          </div>

          {/* Avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 shadow-lg transition-all duration-300"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary hover:bg-secondary text-primary-content hover:scale-110
                  p-2.5 rounded-full cursor-pointer shadow-md
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs opacity-50">
              {isUpdatingProfile ? "Uploading..." : "Click the camera badge to update your avatar"}
            </p>
          </div>

          {/* User Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold opacity-50 flex items-center gap-2 px-1">
                <User className="w-3.5 h-3.5" />
                USERNAME
              </div>
              <p className="px-4 py-3 bg-base-200/50 rounded-xl border border-base-content/5 text-sm font-semibold select-all">
                {authUser?.username}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold opacity-50 flex items-center gap-2 px-1">
                <Mail className="w-3.5 h-3.5" />
                EMAIL ADDRESS
              </div>
              <p className="px-4 py-3 bg-base-200/50 rounded-xl border border-base-content/5 text-sm font-semibold select-all">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account details card */}
          <div className="mt-6 bg-base-200/30 rounded-2xl p-5 border border-base-content/5">
            <h2 className="text-base font-bold tracking-wide mb-4">Account Metadata</h2>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="opacity-60">Member Since</span>
                <span className="font-semibold">{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="opacity-60">Account Status</span>
                <span className="font-bold text-success flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProfilePage;