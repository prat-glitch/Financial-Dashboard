import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    Edit2,
    Settings,
    Wallet,
    Shield,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import Sidebar, { MobileHeader, MobileOverlay } from "./Sidebar.jsx";

const ProfileOverview = () => {
    const { isDarkMode } = useTheme();
    const { user } = useUser();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const quickActions = [
        {
            icon: <User size={18} />,
            label: "Edit Profile",
            link: "/settings",
        },
        {
            icon: <Wallet size={18} />,
            label: "Financial",
            link: "/settings",
        },
        {
            icon: <Shield size={18} />,
            label: "Security",
            link: "/settings",
        },
    ];

    return (
        <div className={`w-full min-h-screen flex ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* MOBILE HEADER */}
            <MobileHeader isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* SIDEBAR */}
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Mobile Overlay */}
            <MobileOverlay isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* MAIN CONTENT */}
            <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
                <div className="max-w-3xl mx-auto">
                    {/* Profile Header Card */}
                    <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl mb-6 shadow-lg ${isDarkMode ? 'bg-linear-to-br from-indigo-900 to-purple-900' : 'bg-linear-to-br from-indigo-600 to-purple-600'}`}>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-xl border-2 sm:border-4 border-white/20">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                                <Link
                                    to="/settings"
                                    className="absolute -bottom-1 -right-1 w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Edit2 size={14} className={isDarkMode ? 'text-purple-600' : 'text-indigo-600'} />
                                </Link>
                            </div>

                            {/* User Info */}
                            <div className="text-center sm:text-left text-white flex-1 space-y-2">
                                <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-white/80">
                                    <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                                        <Mail size={14} />
                                        <span className="truncate max-w-[180px] sm:max-w-none">{user.email}</span>
                                    </span>
                                    {user.phone && (
                                        <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                                            <Phone size={14} />
                                            {user.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={`rounded-2xl sm:rounded-3xl overflow-hidden shadow-md ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
                        <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-gray-50'}`}>
                            <h2 className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <Settings size={16} />
                                Quick Settings
                            </h2>
                        </div>
                        <div className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-100'}`}>
                            {quickActions.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className={`flex items-center justify-between p-4 sm:p-5 transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                                            {item.icon}
                                        </div>
                                        <span className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</span>
                                    </div>
                                    <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileOverview;
