import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

// Normalize API URL - remove trailing slash and ensure no double slashes
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/+$/, '');

const Auth = ({ onLogin, isDarkMode }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!isLogin && form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      const endpoint = isLogin ? "/users/login" : "/users/register";
      const body = isLogin 
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext login
        login(data.token, data.user);
        if (rememberMe) {
          localStorage.setItem("expense_track_remember", "true");
        }
        if (onLogin) onLogin(data.user);
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-3 sm:p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900' 
        : 'bg-linear-to-br from-slate-50 via-white to-violet-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-20 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full blur-3xl ${
          isDarkMode ? 'bg-violet-900/20' : 'bg-violet-200/40'
        }`} />
        <div className={`absolute bottom-1/4 -right-20 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full blur-3xl ${
          isDarkMode ? 'bg-purple-900/20' : 'bg-purple-200/40'
        }`} />
      </div>

      {/* Auth Card */}
      <div className={`relative w-full max-w-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/90 backdrop-blur-xl shadow-violet-500/10' 
          : 'bg-white/90 backdrop-blur-xl shadow-violet-500/10'
      }`}>
        
        {/* Logo */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white text-xl sm:text-2xl font-bold">₹</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            {isLogin ? 'Sign in' : 'Create Account'}
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isLogin 
              ? 'Welcome back! Please sign in to continue' 
              : 'Start your expense tracking journey'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Signup only) */}
          {!isLogin && (
            <div className="relative">
              <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required={!isLogin}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-violet-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
                }`}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email id"
              required
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-violet-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
              }`}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={`w-full pl-12 pr-12 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-violet-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password (Signup only) */}
          {!isLogin && (
            <div className="relative">
              <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required={!isLogin}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 outline-none transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-violet-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-violet-500 focus:bg-white'
                }`}
              />
            </div>
          )}

          {/* Remember Me & Forgot Password (Login only) */}
          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-violet-500 hover:text-violet-600 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <p className="text-sm text-rose-500 text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-violet-400 cursor-not-allowed' 
                : 'bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Login' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <p className={`text-center mt-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setForm({ name: "", email: "", password: "", confirmPassword: "" });
            }}
            className="text-violet-500 hover:text-violet-600 font-semibold"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
