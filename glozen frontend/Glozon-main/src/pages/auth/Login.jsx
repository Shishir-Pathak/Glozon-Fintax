import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import API from "../../API/Api.js";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res?.data?.token);
      const role = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1]),
      )?.role;
      if (role !== "admin") {
        setError("Only Admin Allowed");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }

      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setError("Unable to login right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 p-4 md:p-8">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="absolute -top-[40%] -left-[20%] h-[70%] w-[70%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />

        <div
          className="absolute top-[60%] -right-[10%] h-[50%] w-[40%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white/80 backdrop-blur-2xl shadow-2xl">
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="space-y-3 px-8 pb-6 pt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Admin Login
            </h1>
            <p className="text-base text-zinc-600">
              Secure access to your GlozonFinTax dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-8">
              <div className="space-y-2 group">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-700 transition-colors group-focus-within:text-indigo-600"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-indigo-600" />

                  <input
                    id="email"
                    type="email"
                    placeholder="admin@glozonfintax.com"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white/50 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-700 transition-colors group-focus-within:text-indigo-600"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-indigo-600" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white/50 pl-10 pr-10 text-zinc-900 placeholder:text-zinc-400 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}
            </div>

            <div className="px-8 pb-8 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative h-12 w-full overflow-hidden rounded-xl bg-indigo-600 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Login
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
