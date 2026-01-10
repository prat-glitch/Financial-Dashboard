import React, { useState } from "react";
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
    Wallet,
    Shield,
    Database,
    Palette,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Download,
    AlertTriangle,
    Sun,
    Moon,
    Bell,
    ChevronRight,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";

const Profile = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, updateUser } = useUser();
    const [activeTab, setActiveTab] = useState("user");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Local User Info State for editing
    const [localUserInfo, setLocalUserInfo] = useState({ ...user });

    // Financial Preferences State
    const [preferences, setPreferences] = useState({
        currency: "₹",
        monthlyBudget: 50000,
        monthStart: 1,
        defaultPaymentMethod: "upi",
    });

    // Categories State
    const [categories, setCategories] = useState([
        { id: 1, name: "Shopping", type: "expense", icon: "shopping_bag", color: "#6366f1" },
        { id: 2, name: "Food & Dining", type: "expense", icon: "restaurant", color: "#22c55e" },
        { id: 3, name: "Bills & Utilities", type: "expense", icon: "receipt", color: "#f59e0b" },
        { id: 4, name: "Travel", type: "expense", icon: "flight", color: "#06b6d4" },
        { id: 5, name: "Entertainment", type: "expense", icon: "movie", color: "#a855f7" },
        { id: 6, name: "Salary", type: "income", icon: "payments", color: "#10b981" },
        { id: 7, name: "Freelance", type: "income", icon: "work", color: "#3b82f6" },
        { id: 8, name: "Investments", type: "income", icon: "trending_up", color: "#14b8a6" },
    ]);

    // Category Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: "",
        type: "expense",
        icon: "category",
        color: "#6366f1",
    });

    // Delete Confirmation Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ type: "", id: null });

    // Security State
    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    // App Preferences State (Note: We use global theme now)
    const [appPreferences, setAppPreferences] = useState({
        dashboardLayout: "detailed",
        notifications: true,
    });

    // Available icons for categories
    const availableIcons = [
        "shopping_bag", "restaurant", "receipt", "flight", "movie", "payments",
        "work", "trending_up", "home", "directions_car", "local_hospital",
        "school", "fitness_center", "pets", "child_care", "savings",
        "account_balance", "credit_card", "attach_money", "category"
    ];

    // Available colors for categories
    const availableColors = [
        "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
        "#f43f5e", "#ef4444", "#f97316", "#f59e0b", "#eab308",
        "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
        "#0ea5e9", "#3b82f6", "#6366f1", "#64748b", "#374151"
    ];

    const tabs = [
        { id: "user", label: "User Info", icon: <User size={20} /> },
        { id: "financial", label: "Financial", icon: <Wallet size={20} /> },
        { id: "categories", label: "Categories", icon: <List size={20} /> },
        { id: "security", label: "Security", icon: <Shield size={20} /> },
        { id: "data", label: "Data & Privacy", icon: <Database size={20} /> },
        { id: "appearance", label: "App Preferences", icon: <Palette size={18} /> },
    ];

    const handleSaveUserInfo = () => {
        updateUser(localUserInfo);
        alert("Profile saved successfully!");
    };

    const handleSavePreferences = () => {
        // API call would go here
        alert("Preferences saved successfully!");
    };

    const handleAddCategory = () => {
        if (!newCategory.name.trim()) return;

        const category = {
            id: Date.now(),
            ...newCategory,
        };
        setCategories([...categories, category]);
        setNewCategory({ name: "", type: "expense", icon: "category", color: "#6366f1" });
        setShowCategoryModal(false);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({ ...category });
        setShowCategoryModal(true);
    };

    const handleUpdateCategory = () => {
        setCategories(categories.map(c =>
            c.id === editingCategory.id ? { ...c, ...newCategory } : c
        ));
        setEditingCategory(null);
        setNewCategory({ name: "", type: "expense", icon: "category", color: "#6366f1" });
        setShowCategoryModal(false);
    };

    const handleDeleteCategory = (id) => {
        setDeleteTarget({ type: "category", id });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteTarget.type === "category") {
            setCategories(categories.filter(c => c.id !== deleteTarget.id));
        } else if (deleteTarget.type === "transactions") {
            alert("All transactions deleted!");
        } else if (deleteTarget.type === "account") {
            alert("Account deleted!");
        }
        setShowDeleteModal(false);
        setDeleteTarget({ type: "", id: null });
    };

    const handleChangePassword = () => {
        if (passwordData.new !== passwordData.confirm) {
            alert("Passwords do not match!");
            return;
        }
        // API call would go here
        alert("Password changed successfully!");
        setPasswordData({ current: "", new: "", confirm: "" });
    };

    const handleExportData = () => {
        // In real app, this would call the API
        alert("Downloading transactions.csv...");
    };

    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

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
                            <li className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer transition-all ${isDarkMode ? 'bg-white text-purple-700' : 'bg-indigo-600 text-white shadow-lg'}`}>
                                <Settings size={18} />
                                Settings
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
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-purple-400' : 'text-indigo-500'}`}>Configuration Hub</p>
                        <h1 className={`text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>Settings</h1>
                        <p className={`mt-2 text-sm font-bold max-w-lg leading-relaxed ${isDarkMode ? 'text-purple-300/40' : 'text-zinc-400'}`}>Fine-tune your workspace environment and operational protocols.</p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className={`glass-card rounded-2xl mb-8 p-1.5 border ${isDarkMode ? 'border-purple-800' : 'border-indigo-50 shadow-sm'}`}>
                        <div className="flex flex-wrap gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? (isDarkMode ? "bg-white text-purple-950" : "bg-indigo-600 text-white shadow-md")
                                        : (isDarkMode ? "text-purple-200 hover:text-white hover:bg-white/5" : "text-indigo-900 hover:bg-indigo-50")
                                        }`}
                                >
                                    {tab.icon}
                                    <span className="hidden lg:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className={`glass-card rounded-2xl p-8 border ${isDarkMode ? 'border-purple-800' : 'border-indigo-50 shadow-sm'}`}>
                        {/* USER INFO TAB */}
                        {activeTab === "user" && (
                            <div className="space-y-8">
                                <h3 className={`text-xl font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>Personnel Identity</h3>

                                {/* Avatar Section */}
                                <div className={`flex flex-col md:flex-row items-center gap-8 p-6 rounded-2xl border ${isDarkMode ? 'bg-purple-950/20 border-purple-800 text-white' : 'bg-white border-indigo-50 text-indigo-950 shadow-sm'}`}>
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1 shadow-2xl">
                                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-black overflow-hidden border-4 border-white">
                                                {localUserInfo.avatar ? (
                                                    <img src={localUserInfo.avatar} alt="Avatar" className="w-full h-full object-cover scale-110" />
                                                ) : (
                                                    getInitials(localUserInfo.name)
                                                )}
                                            </div>
                                        </div>
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute inset-0 rounded-full bg-indigo-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm"
                                        >
                                            <Edit2 size={24} className="text-white" />
                                        </label>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        const base64String = reader.result;
                                                        setLocalUserInfo({ ...localUserInfo, avatar: base64String });
                                                        updateUser({ avatar: base64String });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div>
                                            <h4 className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>Profile Visual</h4>
                                            <p className={`text-xs mt-1 font-medium ${isDarkMode ? 'text-indigo-300/40' : 'text-zinc-500'}`}>High-resolution identity marker. Syncs across all portals.</p>
                                        </div>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                            <label htmlFor="avatar-upload" className="btn-premium px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer">
                                                Replace Identity
                                            </label>
                                            {localUserInfo.avatar && (
                                                <button onClick={() => setLocalUserInfo({ ...localUserInfo, avatar: "" })} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDarkMode ? 'bg-rose-950/30 text-rose-400 hover:bg-rose-950' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}>
                                                    Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-indigo-300/40' : 'text-zinc-500'}`}>Personnel Name</label>
                                        <input
                                            type="text"
                                            value={localUserInfo.name}
                                            onChange={(e) => setLocalUserInfo({ ...localUserInfo, name: e.target.value })}
                                            className={`w-full px-6 py-4 rounded-2xl text-sm font-bold border transition-all focus:ring-4 focus:ring-indigo-500/10 focus:outline-none ${isDarkMode ? 'bg-indigo-950/20 border-white/5 text-white' : 'bg-white border-zinc-100'}`}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-indigo-300/40' : 'text-zinc-500'}`}>Credential Email</label>
                                        <input
                                            type="email"
                                            value={localUserInfo.email}
                                            readOnly
                                            className={`w-full px-6 py-4 rounded-2xl text-sm font-bold border opacity-50 cursor-not-allowed ${isDarkMode ? 'bg-indigo-950/40 border-white/5 text-indigo-200' : 'bg-zinc-50 border-zinc-100'}`}
                                        />
                                    </div>
                                </div>

                                <div className="pt-10">
                                    <button onClick={handleSaveUserInfo} className="btn-premium px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em]">
                                        Authorize Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* FINANCIAL PREFERENCES TAB */}
                        {activeTab === "financial" && (
                            <div className="space-y-6">
                                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    <span className="material-icons text-green-500">account_balance_wallet</span>
                                    Financial Preferences
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className="material-icons text-sm mr-1 text-gray-400">currency_exchange</span>
                                            Default Currency
                                        </label>
                                        <select
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                                        >
                                            <option value="₹">₹ Indian Rupee (INR)</option>
                                            <option value="$">$ US Dollar (USD)</option>
                                            <option value="€">€ Euro (EUR)</option>
                                            <option value="£">£ British Pound (GBP)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className="material-icons text-sm mr-1 text-gray-400">savings</span>
                                            Monthly Budget Limit
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                                {preferences.currency}
                                            </span>
                                            <input
                                                type="number"
                                                value={preferences.monthlyBudget}
                                                onChange={(e) => setPreferences({ ...preferences, monthlyBudget: Number(e.target.value) })}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'}`}
                                                placeholder="50000"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className="material-icons text-sm mr-1 text-gray-400">calendar_month</span>
                                            Start of Month
                                        </label>
                                        <select
                                            value={preferences.monthStart}
                                            onChange={(e) => setPreferences({ ...preferences, monthStart: Number(e.target.value) })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                                        >
                                            <option value={1}>1st of every month</option>
                                            <option value={15}>15th of every month</option>
                                            <option value={25}>25th (Salary day)</option>
                                            <option value={28}>28th of every month</option>
                                        </select>
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>When your financial month starts</p>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <span className="material-icons text-sm mr-1 text-gray-400">payment</span>
                                            Default Payment Method
                                        </label>
                                        <select
                                            value={preferences.defaultPaymentMethod}
                                            onChange={(e) => setPreferences({ ...preferences, defaultPaymentMethod: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}
                                        >
                                            <option value="upi">UPI</option>
                                            <option value="credit card">Credit Card</option>
                                            <option value="debit card">Debit Card</option>
                                            <option value="cash">Cash</option>
                                            <option value="net banking">Net Banking</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSavePreferences}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-green-200"
                                >
                                    <Save size={18} />
                                    Save Preferences
                                </button>
                            </div>
                        )}

                        {/* CATEGORIES TAB */}
                        {activeTab === "categories" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                        <span className="material-icons text-purple-500">category</span>
                                        Category Management
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setEditingCategory(null);
                                            setNewCategory({ name: "", type: "expense", icon: "category", color: "#6366f1" });
                                            setShowCategoryModal(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
                                    >
                                        <Plus size={18} />
                                        Add Category
                                    </button>
                                </div>

                                {/* Expense Categories */}
                                <div>
                                    <h4 className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2">
                                        <span className="material-icons text-sm">trending_down</span>
                                        Expense Categories
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categories
                                            .filter((c) => c.type === "expense")
                                            .map((category) => (
                                                <div
                                                    key={category.id}
                                                    className={`flex items-center justify-between p-4 rounded-xl border transition-shadow ${isDarkMode ? 'bg-gray-700/50 border-gray-600 hover:shadow-lg' : 'bg-gray-50 border-gray-100 hover:shadow-md'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                                                            style={{ backgroundColor: category.color }}
                                                        >
                                                            <span className="material-icons text-xl">{category.icon}</span>
                                                        </div>
                                                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{category.name}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditCategory(category)}
                                                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'}`}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Income Categories */}
                                <div>
                                    <h4 className="text-sm font-semibold text-green-500 mb-3 flex items-center gap-2">
                                        <span className="material-icons text-sm">trending_up</span>
                                        Income Categories
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categories
                                            .filter((c) => c.type === "income")
                                            .map((category) => (
                                                <div
                                                    key={category.id}
                                                    className={`flex items-center justify-between p-4 rounded-xl border transition-shadow ${isDarkMode ? 'bg-gray-700/50 border-gray-600 hover:shadow-lg' : 'bg-gray-50 border-gray-100 hover:shadow-md'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                                                            style={{ backgroundColor: category.color }}
                                                        >
                                                            <span className="material-icons text-xl">{category.icon}</span>
                                                        </div>
                                                        <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{category.name}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditCategory(category)}
                                                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'}`}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCategory(category.id)}
                                                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    <span className="material-icons text-amber-500">security</span>
                                    Security Settings
                                </h3>

                                {/* Change Password */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="material-icons text-sm">lock</span>
                                        Change Password
                                    </h4>
                                    <div className="space-y-4 max-w-md">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Current Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={passwordData.current}
                                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'}`}
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordData.new}
                                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'}`}
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordData.confirm}
                                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'}`}
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleChangePassword}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-amber-200"
                                        >
                                            <span className="material-icons text-sm">key</span>
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                {/* Session Info */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="material-icons text-sm">devices</span>
                                        Active Sessions
                                    </h4>
                                    <div className="space-y-3">
                                        <div className={`flex items-center justify-between p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                            <div className="flex items-center gap-3">
                                                <span className="material-icons text-green-500">computer</span>
                                                <div>
                                                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Current Session</p>
                                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Windows • Chrome • Active now</p>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                    <button className={`mt-4 flex items-center gap-2 px-4 py-2 border rounded-xl font-medium transition-colors ${isDarkMode ? 'text-red-400 border-red-900/50 hover:bg-red-900/20' : 'text-red-500 border-red-200 hover:bg-red-50'}`}>
                                        <LogOut size={18} />
                                        Logout from all devices
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* DATA & PRIVACY TAB */}
                        {activeTab === "data" && (
                            <div className="space-y-6">
                                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    <span className="material-icons text-blue-500">storage</span>
                                    Data & Privacy
                                </h3>

                                {/* Export Data */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-blue-900/20 border-blue-900/30' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100'}`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-gray-900'}`}>
                                        <span className="material-icons text-blue-500">download</span>
                                        Export Your Data
                                    </h4>
                                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-blue-200/60' : 'text-gray-600'}`}>
                                        Download all your transactions as a CSV file for backup or analysis.
                                    </p>
                                    <button
                                        onClick={handleExportData}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-blue-200"
                                    >
                                        <Download size={18} />
                                        Export as CSV
                                    </button>
                                </div>

                                {/* Delete Transactions */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-orange-900/20 border-orange-900/30' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'}`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-orange-400' : 'text-gray-900'}`}>
                                        <span className="material-icons text-orange-500">delete_sweep</span>
                                        Delete All Transactions
                                    </h4>
                                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-orange-200/60' : 'text-gray-600'}`}>
                                        This will permanently delete all your transaction history. This action cannot be undone.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setDeleteTarget({ type: "transactions", id: null });
                                            setShowDeleteModal(true);
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-200"
                                    >
                                        <Trash2 size={18} />
                                        Delete All Transactions
                                    </button>
                                </div>

                                {/* Delete Account */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-red-900/20 border-red-900/30' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-100'}`}>
                                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-gray-900'}`}>
                                        <span className="material-icons text-red-500">person_remove</span>
                                        Delete Account
                                    </h4>
                                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-red-200/60' : 'text-gray-600'}`}>
                                        Permanently delete your account and all associated data. You'll have 30 days to recover your account.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setDeleteTarget({ type: "account", id: null });
                                            setShowDeleteModal(true);
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-red-200"
                                    >
                                        <AlertTriangle size={18} />
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === "appearance" && (
                            <div className="space-y-6">
                                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                                    <span className="material-icons text-pink-500">palette</span>
                                    App Preferences
                                </h3>

                                {/* Theme Toggle */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="material-icons text-sm">dark_mode</span>
                                        Theme
                                    </h4>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => isDarkMode && toggleTheme()}
                                            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${!isDarkMode
                                                ? "border-indigo-500 bg-indigo-50/50"
                                                : "border-gray-600 hover:border-gray-500"
                                                }`}
                                        >
                                            <Sun size={24} className={!isDarkMode ? "text-amber-500" : "text-gray-400"} />
                                            <span className={`font-medium ${!isDarkMode ? "text-indigo-700 font-bold" : "text-gray-400"}`}>
                                                Light Mode
                                            </span>
                                            {!isDarkMode && (
                                                <Check size={18} className="text-indigo-500 ml-auto" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => !isDarkMode && toggleTheme()}
                                            className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${isDarkMode
                                                ? "border-indigo-500 bg-indigo-900/30"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <Moon size={24} className={isDarkMode ? "text-indigo-400" : "text-gray-400"} />
                                            <span className={`font-medium ${isDarkMode ? "text-indigo-400 font-bold" : "text-gray-600"}`}>
                                                Dark Mode
                                            </span>
                                            {isDarkMode && (
                                                <Check size={18} className="text-indigo-400 ml-auto" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Dashboard Layout */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        <span className="material-icons text-sm">dashboard</span>
                                        Dashboard Layout
                                    </h4>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setAppPreferences({ ...appPreferences, dashboardLayout: "compact" })}
                                            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${appPreferences.dashboardLayout === "compact"
                                                ? `border-indigo-500 ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`
                                                : `${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`
                                                }`}
                                        >
                                            <div className={`w-16 h-12 rounded flex flex-wrap gap-1 p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                                <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                                <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                                <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                                <div className={`w-3 h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <span className={`font-medium ${appPreferences.dashboardLayout === "compact" ? `${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}` : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}`}>
                                                Compact
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setAppPreferences({ ...appPreferences, dashboardLayout: "detailed" })}
                                            className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${appPreferences.dashboardLayout === "detailed"
                                                ? `border-indigo-500 ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`
                                                : `${isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'}`
                                                }`}
                                        >
                                            <div className={`w-16 h-12 rounded flex flex-col gap-1 p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                                <div className={`w-full h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                                <div className={`w-full h-3 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                                <div className={`w-3/4 h-2 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                                            </div>
                                            <span className={`font-medium ${appPreferences.dashboardLayout === "detailed" ? `${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}` : `${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}`}>
                                                Detailed
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Notifications Toggle */}
                                <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-100'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-icons ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>notifications</span>
                                            <div>
                                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h4>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive alerts about your expenses and budgets</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setAppPreferences({ ...appPreferences, notifications: !appPreferences.notifications })}
                                            className={`relative w-14 h-7 rounded-full transition-colors ${appPreferences.notifications ? "bg-indigo-500" : "bg-gray-300"
                                                }`}
                                        >
                                            <span
                                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${appPreferences.notifications ? "left-8" : "left-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSavePreferences}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-pink-200"
                                >
                                    <Save size={18} />
                                    Save Appearance Settings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setEditingCategory(null);
                                }}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Category Name */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'}`}
                                    placeholder="e.g., Groceries"
                                />
                            </div>

                            {/* Category Type */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setNewCategory({ ...newCategory, type: "expense" })}
                                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${newCategory.type === "expense"
                                            ? `${isDarkMode ? 'bg-red-900/30 text-red-400 border-2 border-red-500' : 'bg-red-100 text-red-700 border-2 border-red-500'}`
                                            : `${isDarkMode ? 'bg-gray-700 text-gray-400 border-2 border-transparent' : 'bg-gray-100 text-gray-600 border-2 border-transparent'}`
                                            }`}
                                    >
                                        <span className="material-icons text-sm mr-1">trending_down</span>
                                        Expense
                                    </button>
                                    <button
                                        onClick={() => setNewCategory({ ...newCategory, type: "income" })}
                                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${newCategory.type === "income"
                                            ? `${isDarkMode ? 'bg-green-900/30 text-green-400 border-2 border-green-500' : 'bg-green-100 text-green-700 border-2 border-green-500'}`
                                            : `${isDarkMode ? 'bg-gray-700 text-gray-400 border-2 border-transparent' : 'bg-gray-100 text-gray-600 border-2 border-transparent'}`
                                            }`}
                                    >
                                        <span className="material-icons text-sm mr-1">trending_up</span>
                                        Income
                                    </button>
                                </div>
                            </div>

                            {/* Icon Picker */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Icon</label>
                                <div className={`grid grid-cols-10 gap-2 p-3 rounded-xl max-h-32 overflow-y-auto ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    {availableIcons.map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => setNewCategory({ ...newCategory, icon })}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${newCategory.icon === icon
                                                ? "bg-indigo-500 text-white shadow-md"
                                                : `${isDarkMode ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-100'}`
                                                }`}
                                        >
                                            <span className="material-icons text-lg">{icon}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Picker */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Color</label>
                                <div className={`flex flex-wrap gap-2 p-3 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    {availableColors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setNewCategory({ ...newCategory, color })}
                                            className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${newCategory.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Preview */}
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Preview</label>
                                <div className={`flex items-center gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                                        style={{ backgroundColor: newCategory.color }}
                                    >
                                        <span className="material-icons">{newCategory.icon}</span>
                                    </div>
                                    <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {newCategory.name || "Category Name"}
                                    </span>
                                    <span
                                        className={`ml-auto px-2 py-1 text-xs font-medium rounded-full ${newCategory.type === "expense"
                                            ? `${isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700'}`
                                            : `${isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700'}`
                                            }`}
                                    >
                                        {newCategory.type}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCategoryModal(false);
                                        setEditingCategory(null);
                                    }}
                                    className={`flex-1 py-3 border rounded-xl font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
                                >
                                    {editingCategory ? "Update Category" : "Add Category"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Confirm Delete</h3>
                            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {deleteTarget.type === "category" && "Are you sure you want to delete this category? This action cannot be undone."}
                                {deleteTarget.type === "transactions" && "Are you sure you want to delete ALL transactions? This action cannot be undone."}
                                {deleteTarget.type === "account" && "Are you sure you want to delete your account? You'll have 30 days to recover it."}
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className={`flex-1 py-3 border rounded-xl font-medium transition-colors ${isDarkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity shadow-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
