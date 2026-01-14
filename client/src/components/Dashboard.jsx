import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell, Sun, Moon, Search, List,
  TrendingUp, Wallet, PieChart, ArrowUpRight, ArrowDownLeft,
  ShoppingCart, Car, Utensils, Briefcase, Plane, Zap, Film, Heart, Gift,
  Gamepad2, Wifi, Phone, CreditCard, ChevronRight
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar, { MobileHeader, MobileOverlay } from "./Sidebar.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('expense_track_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Category icons mapping
const categoryIcons = {
  "Shopping": ShoppingCart,
  "Food": Utensils,
  "Transport": Car,
  "Travel": Plane,
  "Bills": Zap,
  "Entertainment": Film,
  "Healthcare": Heart,
  "Salary": Briefcase,
  "Investment": TrendingUp,
  "Gifts": Gift,
  "Gaming": Gamepad2,
  "Internet": Wifi,
  "Phone": Phone,
  "Other": CreditCard
};

// Category colors mapping
const categoryColors = {
  "Shopping": "#8b5cf6",
  "Food": "#f97316",
  "Transport": "#3b82f6",
  "Travel": "#06b6d4",
  "Bills": "#f59e0b",
  "Entertainment": "#ec4899",
  "Healthcare": "#ef4444",
  "Salary": "#10b981",
  "Investment": "#22c55e",
  "Gifts": "#f43f5e",
  "Gaming": "#6366f1",
  "Internet": "#14b8a6",
  "Phone": "#8b5cf6",
  "Other": "#6b7280"
};

// ===========================================
// REUSABLE COMPONENTS
// ===========================================

// Dashboard Card Component
const DashboardCard = ({ icon: Icon, title, value, color, isDarkMode, isMain = false }) => {
  const colorStyles = {
    purple: {
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
      border: 'border-l-violet-500',
      iconColor: 'text-white'
    },
    emerald: {
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
      border: 'border-l-emerald-500',
      iconColor: 'text-white'
    },
    rose: {
      iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
      border: 'border-l-rose-500',
      iconColor: 'text-white'
    }
  };

  const styles = colorStyles[color] || colorStyles.purple;

  if (isMain) {
    return (
      <div className={`
        group relative rounded-2xl p-6 overflow-hidden cursor-pointer
        transition-all duration-200 ease-out
        hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/10
        ${isDarkMode 
          ? 'bg-linear-to-br from-violet-600 to-purple-700'
          : 'bg-linear-to-br from-violet-500 to-purple-600'}
      `}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Icon size={20} className="text-white/70" />
            <p className="text-sm font-medium text-white/70">{title}</p>
          </div>
          <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{value}</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute right-12 bottom-4 w-20 h-20 rounded-full bg-white/5" />
      </div>
    );
  }

  return (
    <div className={`
      group relative rounded-2xl p-6 border-l-4 overflow-hidden cursor-pointer
      transition-all duration-200 ease-out
      hover:-translate-y-0.5 hover:shadow-lg
      ${isDarkMode 
        ? 'bg-slate-800/80 hover:shadow-purple-500/5' 
        : 'bg-white shadow-sm hover:shadow-purple-500/10'}
      ${styles.border}
    `}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
          <p className={`text-2xl md:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${styles.iconBg}`}>
          <Icon size={22} className={styles.iconColor} />
        </div>
      </div>
    </div>
  );
};

// Chart Card Component
const ChartCard = ({ title, subtitle, children, isDarkMode, className = "", headerRight }) => (
  <div className={`
    rounded-2xl p-6 transition-all duration-200
    ${isDarkMode 
      ? 'bg-slate-800/80' 
      : 'bg-white shadow-sm hover:shadow-md hover:shadow-purple-500/5'}
    ${className}
  `}>
    <div className="flex items-start justify-between mb-6">
      <div>
        <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        {subtitle && <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>}
      </div>
      {headerRight}
    </div>
    {children}
  </div>
);

// Transaction Item Component
const TransactionItem = ({ tx, isDarkMode, formatDate }) => {
  const Icon = categoryIcons[tx.category] || CreditCard;
  const color = categoryColors[tx.category] || "#6b7280";
  
  return (
    <div className={`
      group px-5 py-4 flex items-center gap-4 cursor-pointer
      transition-all duration-200
      ${isDarkMode 
        ? 'hover:bg-slate-700/50' 
        : 'hover:bg-violet-50/50'}
    `}>
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ backgroundColor: isDarkMode ? `${color}20` : `${color}12` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      
      {/* Description & Date */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          {tx.name}
        </p>
        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {formatDate(tx.date)}
        </p>
      </div>

      {/* Category Badge */}
      <div className="hidden sm:block">
        <span className={`
          text-xs px-3 py-1.5 rounded-full font-medium
          ${isDarkMode 
            ? 'bg-violet-500/20 text-violet-300' 
            : 'bg-violet-100 text-violet-600'}
        `}>
          {tx.category}
        </span>
      </div>

      {/* Payment Method */}
      <div className="hidden lg:block w-20">
        <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
          {tx.paymentmethod || 'Cash'}
        </span>
      </div>

      {/* Amount */}
      <p className={`font-bold text-sm shrink-0 min-w-20 text-right ${tx.type === "income" ? 'text-emerald-500' : 'text-rose-500'}`}>
        {tx.type === "income" ? '+' : '-'}₹{tx.amount?.toLocaleString()}
      </p>
    </div>
  );
};

// ===========================================
// MAIN DASHBOARD COMPONENT
// ===========================================

const Dashboard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    monthlyIncome: 0,
    monthlyExpense: 0,
    categoryBreakdown: [],
    monthlyTrend: [],
    recentTransactions: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transactions/stats`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount?.toLocaleString() || 0}`;
  };

  // Generate pie chart conic gradient
  const generatePieSegments = () => {
    if (!stats.categoryBreakdown || stats.categoryBreakdown.length === 0) {
      return isDarkMode ? "rgb(51 65 85) 0deg 360deg" : "rgb(237 233 254) 0deg 360deg";
    }
    const total = stats.categoryBreakdown.reduce((sum, c) => sum + c.total, 0);
    let acc = 0;
    return stats.categoryBreakdown.map((c) => {
      const start = (acc / total) * 360;
      acc += c.total;
      const end = (acc / total) * 360;
      const color = categoryColors[c._id] || "#6b7280";
      return `${color} ${start}deg ${end}deg`;
    }).join(", ");
  };

  // Get chart max value for bar heights
  const maxTrend = stats.monthlyTrend?.length > 0 
    ? Math.max(...stats.monthlyTrend.map(m => Math.max(m.income || 0, m.expense || 0)), 1000) 
    : 10000;

  return (
    <div className={`w-full min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-[#f8f7fc]'}`}>

      {/* ======================= */}
      {/* MOBILE HEADER */}
      {/* ======================= */}
      <MobileHeader isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* ======================= */}
      {/* SIDEBAR */}
      {/* ======================= */}
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Mobile Overlay */}
      <MobileOverlay isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* ======================= */}
      {/* MAIN CONTENT */}
      {/* ======================= */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        
        {/* TOP BAR */}
        <header className={`
          sticky top-0 z-30 px-4 md:px-6 lg:px-8 py-4 border-b
          ${isDarkMode 
            ? 'bg-slate-900/95 border-slate-800 backdrop-blur-xl' 
            : 'bg-white/95 border-violet-100 backdrop-blur-xl'}
        `}>
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            {/* Greeting */}
            <div className="hidden sm:block">
              <h1 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Hi, {user?.name?.split(' ')[0] || 'User'} 👋
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Welcome back to your dashboard
              </p>
            </div>

            {/* Search Input */}
            <div className="flex-1 max-w-md">
              <div className={`
                flex items-center gap-3 px-4 py-2.5 rounded-xl border
                transition-all duration-200
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus-within:border-violet-500/50' 
                  : 'bg-violet-50/50 border-violet-100 focus-within:border-violet-300 focus-within:bg-white'}
              `}>
                <Search size={18} className={isDarkMode ? 'text-slate-500' : 'text-violet-400'} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'}`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-violet-100 text-slate-500'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-violet-100 text-slate-500'}`}>
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-violet-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>
              <Link to="/profile">
                <div className={`w-10 h-10 rounded-xl overflow-hidden ring-2 transition-all duration-200 ${isDarkMode ? 'ring-slate-700 hover:ring-violet-500/50' : 'ring-violet-200 hover:ring-violet-400'}`}>
                  {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-medium bg-linear-to-br from-violet-400 to-purple-500 text-white">
                      {getInitials(user?.name || "User")}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
          
            {/* ======================= */}
            {/* SUMMARY CARDS */}
            {/* ======================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              <DashboardCard
                icon={Wallet}
                title="Total Balance"
                value={loading ? "..." : formatCurrency(stats.balance)}
                isDarkMode={isDarkMode}
                isMain={true}
              />
              <DashboardCard
                icon={ArrowDownLeft}
                title="Monthly Income"
                value={loading ? "..." : formatCurrency(stats.monthlyIncome)}
                color="emerald"
                isDarkMode={isDarkMode}
              />
              <DashboardCard
                icon={ArrowUpRight}
                title="Monthly Expense"
                value={loading ? "..." : formatCurrency(stats.monthlyExpense)}
                color="rose"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* ======================= */}
            {/* ANALYTICS SECTION */}
            {/* ======================= */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
              
              {/* Bar Chart - Monthly Expenses */}
              <ChartCard 
                title="Monthly Expenses" 
                subtitle="Income vs Expense comparison"
                isDarkMode={isDarkMode}
                className="lg:col-span-3"
                headerRight={
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Income</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Expense</span>
                    </div>
                  </div>
                }
              >
                <div className="flex items-end gap-3 sm:gap-5 h-52 overflow-x-auto pb-2 -mx-2 px-2">
                  {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" />
                    </div>
                  ) : stats.monthlyTrend?.length > 0 ? (
                    stats.monthlyTrend.map((month, index) => (
                      <div key={index} className="flex-1 min-w-14 flex flex-col items-center gap-3">
                        <div className="w-full flex gap-1.5 items-end justify-center h-40">
                          <div
                            className="flex-1 max-w-6 rounded-t-lg bg-linear-to-t from-emerald-500 to-emerald-400 transition-all duration-300 hover:from-emerald-400 hover:to-emerald-300 cursor-pointer"
                            style={{ height: `${Math.max(((month.income || 0) / maxTrend) * 100, 4)}%` }}
                            title={`Income: ₹${month.income?.toLocaleString()}`}
                          />
                          <div
                            className="flex-1 max-w-6 rounded-t-lg bg-linear-to-t from-rose-500 to-rose-400 transition-all duration-300 hover:from-rose-400 hover:to-rose-300 cursor-pointer"
                            style={{ height: `${Math.max(((month.expense || 0) / maxTrend) * 100, 4)}%` }}
                            title={`Expense: ₹${month.expense?.toLocaleString()}`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {month._id?.month || month.month}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-8">
                      <TrendingUp size={40} className={isDarkMode ? 'text-slate-700' : 'text-violet-200'} />
                      <p className={`text-sm mt-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No data available</p>
                    </div>
                  )}
                </div>
              </ChartCard>

              {/* Pie Chart - Category Distribution */}
              <ChartCard 
                title="Category-wise Expense" 
                subtitle="Spending distribution"
                isDarkMode={isDarkMode}
                className="lg:col-span-2"
              >
                <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-6">
                  {/* Pie */}
                  <div
                    className="w-36 h-36 rounded-full shrink-0 transition-transform duration-300 hover:scale-105 cursor-pointer"
                    style={{
                      backgroundImage: `conic-gradient(${generatePieSegments()})`,
                      boxShadow: isDarkMode ? 'inset 0 0 0 24px rgb(15 23 42)' : 'inset 0 0 0 24px rgb(255 255 255)'
                    }}
                  />
                  
                  {/* Legend */}
                  <div className="flex-1 w-full space-y-2.5 max-h-48 overflow-y-auto">
                    {loading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full" />
                      </div>
                    ) : stats.categoryBreakdown?.length > 0 ? (
                      stats.categoryBreakdown.map((cat) => {
                        const color = categoryColors[cat._id] || "#6b7280";
                        const total = stats.categoryBreakdown.reduce((sum, c) => sum + c.total, 0);
                        const percentage = total > 0 ? ((cat.total / total) * 100).toFixed(0) : 0;
                        return (
                          <div key={cat._id} className={`flex items-center justify-between gap-3 p-2 rounded-lg transition-colors duration-200 ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-violet-50'}`}>
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                              <span className={`text-sm truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{cat._id}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{percentage}%</span>
                              <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                                {formatCurrency(cat.total)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-6">
                        <PieChart size={28} className={isDarkMode ? 'text-slate-700 mx-auto' : 'text-violet-200 mx-auto'} />
                        <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No categories</p>
                      </div>
                    )}
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* ======================= */}
            {/* RECENT TRANSACTIONS */}
            {/* ======================= */}
            <div className={`rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800/80' : 'bg-white shadow-sm'}`}>
              {/* Header */}
              <div className={`px-5 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700/50' : 'border-violet-100'}`}>
                <div>
                  <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Recent Transactions</h3>
                  <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Your latest 5 transactions</p>
                </div>
                <Link 
                  to="/all-transactions"
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isDarkMode 
                      ? 'text-violet-400 hover:text-violet-300 hover:bg-violet-500/10' 
                      : 'text-violet-600 hover:text-violet-700 hover:bg-violet-50'}
                  `}
                >
                  View All
                  <ChevronRight size={16} />
                </Link>
              </div>

              {/* Table Header - Hidden on mobile */}
              <div className={`hidden md:flex items-center px-5 py-3 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'bg-slate-700/30 text-slate-500' : 'bg-violet-50/50 text-slate-400'}`}>
                <div className="flex-1 flex items-center gap-4">
                  <span className="w-11" />
                  <span>Description</span>
                </div>
                <span className="w-28 text-center hidden sm:block">Category</span>
                <span className="w-20 text-center hidden lg:block">Method</span>
                <span className="w-24 text-right">Amount</span>
              </div>

              {/* Transaction Rows */}
              <div className={`divide-y ${isDarkMode ? 'divide-slate-700/30' : 'divide-violet-100/50'}`}>
                {loading ? (
                  <div className="px-5 py-16 text-center">
                    <div className="animate-spin w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full mx-auto" />
                    <p className={`text-sm mt-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Loading transactions...</p>
                  </div>
                ) : stats.recentTransactions?.length > 0 ? (
                  stats.recentTransactions.slice(0, 5).map((tx) => (
                    <TransactionItem key={tx._id} tx={tx} isDarkMode={isDarkMode} formatDate={formatDate} />
                  ))
                ) : (
                  <div className="px-5 py-16 text-center">
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-slate-700' : 'bg-violet-100'}`}>
                      <List size={28} className={isDarkMode ? 'text-slate-500' : 'text-violet-400'} />
                    </div>
                    <p className={`font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No transactions yet</p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      Start tracking your expenses
                    </p>
                    <Link 
                      to="/all-transactions" 
                      className={`
                        inline-flex items-center gap-1 text-sm font-medium mt-4 px-5 py-2.5 rounded-xl
                        transition-all duration-200
                        ${isDarkMode 
                          ? 'bg-violet-600 text-white hover:bg-violet-500' 
                          : 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/25'}
                      `}
                    >
                      Add Transaction
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
