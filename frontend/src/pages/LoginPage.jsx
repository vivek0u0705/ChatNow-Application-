import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
} from "lucide-react";
import AnimatedChatPreview from "../components/AnimatedChatPreview";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn, googleAuth } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">

      {/* LEFT SIDE: FORM */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="card glass-panel glass-panel-glow shadow-2xl rounded-3xl">
            <div className="card-body p-8 space-y-6">

              {/* Logo & Header */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Welcome Back 👋
                </h1>
                <p className="text-base-content/60 text-sm">
                  Sign in to continue your conversations
                </p>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold opacity-80">Email or Username</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/30" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-11 rounded-xl input-premium focus:outline-none"
                      placeholder="you@example.com or johndoe"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold opacity-80">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full pl-11 pr-11 rounded-xl input-premium focus:outline-none"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-primary transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                <div className="divider text-base-content/40 text-xs font-semibold uppercase tracking-wider">OR</div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      googleAuth(credentialResponse.credential);
                    }}
                    onError={() => {
                      toast.error("Google Login Failed");
                    }}
                  />
                </div>
              </form>

              {/* Toggle to Signup */}
              <div className="text-center pt-2">
                <p className="text-sm text-base-content/60">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-primary hover:underline hover:text-secondary transition-colors duration-200"
                  >
                    Create account
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: ANIMATED PREVIEW (HIDDEN ON MOBILE) */}
      <div className="hidden lg:flex flex-col justify-center items-center p-10 space-y-8 bg-base-100/30 border-l border-base-content/5 relative z-10">
        
        <AnimatedChatPreview />

        <div className="text-center max-w-md space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back!
          </h2>
          <p className="text-base-content/60 leading-relaxed">
            Sign in to continue your conversations and stay connected with your friends and teammates in real-time.
          </p>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;