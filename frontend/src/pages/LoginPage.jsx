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

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-200">

      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-2xl border border-base-300">
            <div className="card-body p-8 space-y-6">

              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-md">
                    <MessageSquare className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Welcome Back 👋
                </h1>
                <p className="text-base-content/60 text-sm">
                  Sign in to continue your conversations
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10 focus:input-primary"
                      placeholder="you@example.com"
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
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input input-bordered w-full pl-10 pr-10 focus:input-primary"
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
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-base-content/40 hover:text-primary transition" />
                      ) : (
                        <Eye className="h-5 w-5 text-base-content/40 hover:text-primary transition" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full mt-4 shadow-md"
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
              </form>

              <div className="text-center pt-2">
                <p className="text-sm text-base-content/60">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Create account
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center p-10 space-y-8">

        <AnimatedChatPreview />

        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <p className="text-base-content/60 mt-2">
            Sign in to continue your conversations and catch up with your messages.
          </p>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;