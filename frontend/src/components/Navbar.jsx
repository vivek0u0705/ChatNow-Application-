import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-base-100/70 border-b border-base-content/5 shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-95">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shadow-sm group-hover:rotate-6 transition-all duration-300">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold tracking-tight">
                ChatNow
              </h1>
            </Link>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="btn btn-sm btn-ghost gap-2 rounded-full border border-base-content/5 hover:bg-base-content/10 hover:border-transparent transition-all duration-200"
            >
              <Settings className="w-4 h-4 opacity-70 group-hover:spin" />
              <span className="hidden sm:inline font-medium">Settings</span>
            </Link>

            {authUser ? (
              <>
                <Link 
                  to={"/profile"} 
                  className="btn btn-sm btn-ghost gap-2 rounded-full border border-base-content/5 hover:bg-base-content/10 hover:border-transparent transition-all duration-200"
                >
                  <User className="size-4 opacity-70" />
                  <span className="hidden sm:inline font-medium">Profile</span>
                </Link>

                <button 
                  onClick={logout}
                  className="btn btn-sm btn-ghost gap-2 rounded-full border border-error/10 text-error hover:bg-error/10 hover:border-error/20 transition-all duration-200"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;