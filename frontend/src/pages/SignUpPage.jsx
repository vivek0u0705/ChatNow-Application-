import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AnimatedChatPreviewForSignUp from "../components/AnimatedChatPreviewForSignUp";
import { GoogleLogin } from "@react-oauth/google";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp, googleAuth } = useAuthStore();

  const validateForm = () => {
    if (!formData.username.trim())
      return toast.error("Username is required");

    if (!formData.email.trim())
      return toast.error("Email is required");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid email format");

    if (!formData.password)
      return toast.error("Password is required");

    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen bg-base-200 grid lg:grid-cols-2">

      {/* LEFT SIDE: FORM */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md animate-fade-in-up">
          
          <div className="card glass-panel glass-panel-glow shadow-2xl rounded-3xl">
            <div className="card-body p-8 space-y-6">

              {/* Logo + Title */}
              <div className="text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm">
                    <MessageSquare className="size-7 text-primary" />
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight mt-2">
                    Create Account
                  </h1>
                  <p className="text-base-content/60 text-sm">
                    Get started with your free account
                  </p>
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Username */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold opacity-80">Username</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-11 rounded-xl input-premium focus:outline-none"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold opacity-80">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
                    <input
                      type="email"
                      className="input input-bordered w-full pl-11 rounded-xl input-premium focus:outline-none"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-semibold opacity-80">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
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
                    />
                    <button
                      type="button"
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-primary transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-full mt-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="divider text-base-content/40 text-xs font-semibold uppercase tracking-wider">OR</div>

                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      googleAuth(credentialResponse.credential);
                    }}
                    onError={() => {
                      toast.error("Google Sign Up Failed");
                    }}
                  />
                </div>
              </form>

              {/* Footer */}
              <div className="text-center">
                <p className="text-sm text-base-content/60">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-primary hover:underline hover:text-secondary transition-colors duration-200">
                    Sign in
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: PREVIEW */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-base-100/30 border-l border-base-content/5 px-10 py-16 space-y-8 relative z-10">
        
        <AnimatedChatPreviewForSignUp />

        <div className="text-center max-w-md space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Join our community
          </h2>
          <p className="text-base-content/60 leading-relaxed">
            Connect with friends, share moments, and stay in touch with your loved ones instantly.
          </p>
        </div>

      </div>

    </div>
  );
};

export default SignUpPage;