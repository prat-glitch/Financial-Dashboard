import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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

      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";
      const body = isLogin 
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const response = await fetch(`${API_BASE.replace('/api', '')}${endpoint}`, {
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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    // For demo purposes, we'll create a mock Google login
    // In production, you'd integrate with Google OAuth
    try {
      // Simulate Google OAuth - in production use @react-oauth/google or firebase
      const mockGoogleUser = {
        name: "Google User",
        email: "user@gmail.com",
        avatar: "",
        googleId: "google_" + Date.now()
      };

      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const od: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockGoogleUser)
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext login
        login(data.token, data.user);
        if (onLogin) onLogin(data.user);
      } else {
        setError(data.message || "Google authentication failed");
      }
    } catch (err) {
      setError("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-violet-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-3xl ${
          isDarkMode ? 'bg-violet-900/20' : 'bg-violet-200/40'
        }`} />
        <div className={`absolute bottom-1/4 -right-20 w-80 h-80 rounded-full blur-3xl ${
          isDarkMode ? 'bg-purple-900/20' : 'bg-purple-200/40'
        }`} />
      </div>

      {/* Auth Card */}
      <div className={`relative w-full max-w-md rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-800/90 backdrop-blur-xl shadow-violet-500/10' 
          : 'bg-white/90 backdrop-blur-xl shadow-violet-500/10'
      }`}>
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white text-2xl font-bold">₹</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            {isLogin ? 'Sign in' : 'Create Account'}
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {isLogin 
              ? 'Welcome back! Please sign in to continue' 
              : 'Start your expense tracking journey'}
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            or sign {isLogin ? 'in' : 'up'} with email
          </span>
          <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
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
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40'
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
