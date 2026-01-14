import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, List, Target, Settings, LogOut, Sun, Moon, ChevronRight, Menu, X
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// Sidebar navigation items - consistent across all pages
const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: List, label: "Transactions", path: "/all-transactions" },
  { icon: Target, label: "Budget", path: "/budget" }
];

// Helper function
const getInitials = (name) => {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
};

// Mobile Header Component
export const MobileHeader = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/98 border-slate-800 backdrop-blur-xl' : 'bg-white/98 border-violet-100 backdrop-blur-xl'}`}>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white font-bold text-sm">₹</div>
        <span className={`font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ExpenseTrack</span>
      </div>
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-violet-100 text-slate-600'}`}
      >
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </div>
  );
};

// Mobile Overlay Component
export const MobileOverlay = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  if (!isMobileMenuOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" 
      onClick={() => setIsMobileMenuOpen(false)} 
    />
  );
};

// Main Sidebar Component
const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUser();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleViewProfile = () => {
    setIsMobileMenuOpen(false);
    navigate("/profile");
  };

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 flex flex-col
      transition-transform duration-300 md:translate-x-0
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      ${isDarkMode 
        ? 'bg-slate-900 border-r border-slate-800' 
        : 'bg-white border-r border-violet-100'}
    `}>
      
      {/* Logo */}
      <div className={`p-5 border-b shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-violet-100'}`}>
        <div className="hidden md:flex items-center gap-2.5">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white font-bold shadow-lg shadow-purple-500/25">₹</div>
          <span className={`font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>ExpenseTrack</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <p className={`text-[10px] font-semibold uppercase tracking-wider px-3 mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Menu</p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm
                  transition-all duration-200
                  ${isActive 
                    ? (isDarkMode 
                        ? 'bg-linear-to-r from-violet-600/20 to-purple-600/20 text-violet-400 border border-violet-500/30'
                        : 'bg-linear-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200')
                    : (isDarkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                        : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50')}
                `}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User & Settings */}
      <div className={`p-4 border-t shrink-0 ${isDarkMode ? 'border-slate-800' : 'border-violet-100'}`}>
        <div 
          onClick={handleViewProfile}
          className={`
            flex items-center gap-3 p-3 rounded-xl mb-3 cursor-pointer
            transition-all duration-200
            ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-violet-50'}
          `}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm overflow-hidden bg-linear-to-br from-violet-400 to-purple-500 text-white">
            {user?.avatar ? (
              <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span>{getInitials(user?.name || "User")}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {user?.name || "User"}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>View Profile</p>
          </div>
          <ChevronRight size={16} className={isDarkMode ? 'text-slate-600' : 'text-slate-300'} />
        </div>

        <div className="space-y-1">
          <Link 
            to="/settings" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'}`}
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'}`}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm cursor-pointer transition-all duration-200 ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-500 hover:bg-rose-50'}`}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
