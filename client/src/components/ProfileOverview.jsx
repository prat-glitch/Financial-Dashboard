import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Home,
    List,
    CreditCard,
    Target,
    PieChart,
    Settings,
    LogOut,
    User,
    Mail,
    Phone,
    Calendar,
    Wallet,
    Edit2,
    ChevronRight,
    Bell,
    Shield,
    Moon,
    Sun,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";

const ProfileOverview = () => {
    const { isDarkMode } = useTheme();
    const { user } = useUser();

    // Member since is not in context yet, we can add it or hardcode for now
    // But name, email, phone, avatar should come from context
    const fullUser = {
        ...user,
        memberSince: "January 2024",
    };

    const [stats, setStats] = useState({
        totalTransactions: 156,
        categoriesCreated: 8,
        thisMonthSpent: 24093,
        budgetRemaining: 25907,
    });

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const quickSettings = [
        {
            icon: <User size={20} />,
            label: "Edit Profile",
            description: "Update your personal information",
            link: "/settings",
            tab: "user",
        },
        {
            icon: <Wallet size={20} />,
            label: "Financial Settings",
            description: "Manage budget and preferences",
            link: "/settings",
            tab: "financial",
        },
        {
            icon: <List size={20} />,
            label: "Categories",
            description: "Add or modify expense categories",
            link: "/settings",
            tab: "categories",
        },
        {
            icon: <Shield size={20} />,
            label: "Security",
            description: "Password and session management",
            link: "/settings",
            tab: "security",
        },
    ];

    return (
        <div className={`w-full min-h-screen flex ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
            {/* SIDEBAR */}
            <aside className={`w-64 border-r transition-all duration-500 flex flex-col p-6 h-screen sticky top-0 ${isDarkMode
                ? 'bg-purple-950 border-purple-800 text-white'
                : 'bg-white border-indigo-50 text-indigo-900'}`}>

                <h1 className="text-2xl font-black mb-10 flex items-center gap-2">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-lg shadow-sm font-black italic ${isDarkMode ? 'bg-white text-purple-700' : 'bg-indigo-600 text-white'}`}>
                        ₹
                    </span>
                    <span className="tracking-tight italic text-inherit">ExpenseTrack</span>
                </h1>

                <nav className="flex flex-col space-y-6">
                    <ul className="space-y-1">
                        <li className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-indigo-900 hover:bg-indigo-50'}`}>
                            <Home size={18} />
                            <Link to="/" className="flex-1">Dashboard</Link>
                        </li>
                        <li className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-indigo-900 hover:bg-indigo-50'}`}>
                            <List size={18} />
                            <Link to="/transactions" className="flex-1">Transactions</Link>
                        </li>
                    </ul>

                    <div className="pt-6 border-t border-purple-800/20 dark:border-purple-800/50">
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDarkMode ? 'text-purple-400' : 'text-indigo-400'}`}>Management</p>
                        <ul className="space-y-1">
                            <li className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-indigo-900 hover:bg-indigo-50'}`}>
                                <Settings size={18} />
                                <Link to="/settings" className="flex-1">Settings</Link>
                            </li>
                            <li className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all hover:translate-x-1 ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}>
                                <LogOut size={18} />
                                Logout
                            </li>
                        </ul>
                    </div>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header Card */}
                    <div className={`p-8 rounded-2xl mb-8 border ${isDarkMode ? 'bg-purple-900 border-purple-800 text-white' : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'}`}>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white/30">
                                    {fullUser.avatar ? (
                                        <img
                                            src={fullUser.avatar}
                                            alt="Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        getInitials(fullUser.name)
                                    )}
                                </div>
                                <Link
                                    to="/settings"
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                >
                                    <Edit2 size={18} className="text-indigo-600" />
                                </Link>
                            </div>

                            {/* User Info */}
                            <div className="text-center md:text-left text-white flex-1">
                                <h1 className="text-3xl font-bold mb-2">{fullUser.name}</h1>
                                <div className="flex flex-col md:flex-row gap-4 text-white/80">
                                    <span className="flex items-center gap-2 justify-center md:justify-start">
                                        <Mail size={16} />
                                        {fullUser.email}
                                    </span>
                                    <span className="flex items-center gap-2 justify-center md:justify-start">
                                        <Phone size={16} />
                                        {fullUser.phone}
                                    </span>
                                </div>
                                <p className="mt-3 text-white/60 text-sm flex items-center gap-2 justify-center md:justify-start">
                                    <Calendar size={14} />
                                    Member since {fullUser.memberSince}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Link
                                    to="/settings"
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white text-purple-950 shadow-none' : 'bg-white text-indigo-600 shadow-md hover:bg-indigo-50'}`}
                                >
                                    Personalize Identity
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-white border-gray-100' : 'bg-white border-gray-100'}`}>
                            <p className={isDarkMode ? 'text-gray-400 text-sm mb-1' : 'text-gray-500 text-sm mb-1'}>Transactions</p>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-950' : 'text-gray-900'}`}>{stats.totalTransactions}</p>
                        </div>
                        <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-white border-gray-100' : 'bg-white border-gray-100'}`}>
                            <p className={isDarkMode ? 'text-gray-400 text-sm mb-1' : 'text-gray-500 text-sm mb-1'}>Categories</p>
                            <p className={`text-2xl font-bold ${isDarkMode ? 'text-indigo-950' : 'text-gray-900'}`}>{stats.categoriesCreated}</p>
                        </div>
                        <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-white border-gray-100' : 'bg-white border-gray-100'}`}>
                            <p className={isDarkMode ? 'text-gray-400 text-sm mb-1' : 'text-gray-500 text-sm mb-1'}>This Month</p>
                            <p className="text-2xl font-bold text-red-500">
                                ₹{stats.thisMonthSpent.toLocaleString()}
                            </p>
                        </div>
                        <div className={`rounded-2xl p-5 shadow-sm border ${isDarkMode ? 'bg-white border-gray-100' : 'bg-white border-gray-100'}`}>
                            <p className={isDarkMode ? 'text-gray-400 text-sm mb-1' : 'text-gray-500 text-sm mb-1'}>Budget Left</p>
                            <p className="text-2xl font-bold text-green-500">
                                ₹{stats.budgetRemaining.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Quick Settings */}
                    <div className={`bg-white shadow-sm transition-all duration-300 rounded-2xl border ${isDarkMode ? 'border-purple-200/20' : 'border-indigo-50'}`}>
                        <div className="px-6 py-5 border-b border-inherit bg-black/5">
                            <h2 className={`text-sm font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>Operational Access</h2>
                        </div>
                        <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                            {quickSettings.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.link}
                                    className={`flex items-center justify-between p-5 transition-colors ${isDarkMode ? 'hover:bg-gray-50' : 'hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-indigo-950' : 'text-gray-900'}`}>{item.label}</h3>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Current Preferences Summary */}
                    <div className={`rounded-2xl shadow-sm border p-6 ${isDarkMode ? 'bg-white border-gray-100' : 'bg-white border-gray-100'}`}>
                        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-indigo-950' : 'text-gray-900'}`}>Current Preferences</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                                    <span className={`font-bold text-lg ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>₹</span>
                                </div>
                                <div>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Currency</p>
                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        INR
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                    <Wallet size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                                </div>
                                <div>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Monthly Budget</p>
                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        ₹50,000
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                    {isDarkMode ? (
                                        <Moon size={20} className="text-purple-400" />
                                    ) : (
                                        <Sun size={20} className="text-purple-600" />
                                    )}
                                </div>
                                <div>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Theme</p>
                                    <p className={`font-medium text-white capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{isDarkMode ? 'dark' : 'light'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                                    <Bell size={20} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                                </div>
                                <div>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Notifications</p>
                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Enabled
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileOverview;
