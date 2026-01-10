import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, List, Target, Settings, LogOut, Sun, Moon, Save,
  PiggyBank, TrendingUp, AlertCircle, CheckCircle, Wallet,
  ShoppingCart, Car, Utensils, Briefcase, Plane, Zap, Film, Heart, Gift,
  Gamepad2, Wifi, Phone, CreditCard, Menu, X, ChevronLeft, ChevronRight,
  Plus, Minus, RefreshCw, Sparkles, ChevronDown, Trash2, Edit3
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";

const API_BASE = "http://localhost:3000/api";

// Category icons mapping
const categoryIcons = {
  "Shopping": ShoppingCart,
  "Food": Utensils,
  "Food & Dining": Utensils,
  "Transport": Car,
  "Transportation": Car,
  "Travel": Plane,
  "Bills": Zap,
  "Bills & Utilities": Zap,
  "Entertainment": Film,
  "Healthcare": Heart,
  "Health": Heart,
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
  "Food & Dining": "#f97316",
  "Transport": "#3b82f6",
  "Transportation": "#3b82f6",
  "Travel": "#06b6d4",
  "Bills": "#f59e0b",
  "Bills & Utilities": "#f59e0b",
  "Entertainment": "#ec4899",
  "Healthcare": "#ef4444",
  "Health": "#ef4444",
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

// Category Budget Input Card - Editable with delete option
const CategoryBudgetCard = ({ categoryName, budget, spent, onChange, onDelete, isDarkMode }) => {
  const Icon = categoryIcons[categoryName] || CreditCard;
  const color = categoryColors[categoryName] || "#6b7280";
  const percentage = budget > 0 ? Math.round((spent / budget) * 100) : 0;
  const remaining = budget - spent;
  
  const getStatusColor = () => {
    if (percentage > 100) return 'rose';
    if (percentage > 80) return 'amber';
    return 'emerald';
  };

  const statusColor = getStatusColor();

  return (
    <div className={`
      group rounded-2xl p-5 border-l-4 transition-all duration-200
      hover:-translate-y-0.5 hover:shadow-lg
      ${isDarkMode 
        ? 'bg-slate-800/80 hover:shadow-purple-500/5' 
        : 'bg-white shadow-sm hover:shadow-purple-500/10'}
    `}
    style={{ borderLeftColor: color }}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: isDarkMode ? `${color}20` : `${color}15` }}
        >
          <Icon size={22} style={{ color }} />
        </div>

        {/* Category Info & Input */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {categoryName}
            </h4>
            <div className="flex items-center gap-2">
              {spent > 0 && (
                <span className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  ${statusColor === 'rose' && !isDarkMode ? 'bg-rose-100 text-rose-600' : ''}
                  ${statusColor === 'amber' && !isDarkMode ? 'bg-amber-100 text-amber-600' : ''}
                  ${statusColor === 'emerald' && !isDarkMode ? 'bg-emerald-100 text-emerald-600' : ''}
                  ${isDarkMode && statusColor === 'rose' ? 'bg-rose-500/20 text-rose-400' : ''}
                  ${isDarkMode && statusColor === 'amber' ? 'bg-amber-500/20 text-amber-400' : ''}
                  ${isDarkMode && statusColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                `}>
                  {percentage}% used
                </span>
              )}
              <button
                onClick={() => onDelete(categoryName)}
                className={`p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${isDarkMode ? 'hover:bg-rose-500/20 text-rose-400' : 'hover:bg-rose-100 text-rose-500'}`}
                title="Remove budget"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Budget Input */}
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>₹</span>
            <input
              type="number"
              value={budget || ''}
              onChange={(e) => onChange(categoryName, parseFloat(e.target.value) || 0)}
              placeholder="Set budget..."
              className={`
                w-full pl-8 pr-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 outline-none
                ${isDarkMode 
                  ? 'bg-slate-700/50 text-white placeholder-slate-500 border border-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20' 
                  : 'bg-violet-50/50 text-slate-800 placeholder-slate-400 border border-violet-100 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'}
              `}
            />
          </div>

          {/* Spent & Remaining */}
          {budget > 0 && (
            <div className="mt-3 space-y-2">
              {/* Progress Bar */}
              <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    statusColor === 'rose' ? 'bg-rose-500' :
                    statusColor === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              
              {/* Stats */}
              <div className="flex justify-between text-xs">
                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
                  Spent: ₹{spent.toLocaleString()}
                </span>
                <span className={`font-medium ${remaining < 0 ? 'text-rose-500' : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')}`}>
                  {remaining >= 0 ? `₹${remaining.toLocaleString()} left` : `₹${Math.abs(remaining).toLocaleString()} over`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Savings Card Component
const SavingsCard = ({ title, value, subtitle, icon: Icon, color, isDarkMode, isMain = false }) => {
  const colorStyles = {
    violet: { bg: 'from-violet-500 to-purple-600', text: 'text-violet-500', light: 'bg-violet-100' },
    emerald: { bg: 'from-emerald-400 to-teal-500', text: 'text-emerald-500', light: 'bg-emerald-100' },
    rose: { bg: 'from-rose-400 to-pink-500', text: 'text-rose-500', light: 'bg-rose-100' },
    amber: { bg: 'from-amber-400 to-orange-500', text: 'text-amber-500', light: 'bg-amber-100' }
  };

  const style = colorStyles[color] || colorStyles.violet;

  if (isMain) {
    return (
      <div className={`
        relative rounded-2xl p-6 overflow-hidden
        bg-linear-to-br ${style.bg}
      `}>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Icon size={20} className="text-white/70" />
            <p className="text-sm font-medium text-white/70">{title}</p>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-10 bottom-2 w-16 h-16 rounded-full bg-white/5" />
      </div>
    );
  }

  return (
    <div className={`
      rounded-2xl p-5 border-l-4 transition-all duration-200
      hover:-translate-y-0.5 hover:shadow-lg
      ${isDarkMode 
        ? 'bg-slate-800/80 border-l-violet-500' 
        : 'bg-white shadow-sm border-l-violet-500 hover:shadow-purple-500/10'}
    `}>
      <div className="flex items-center gap-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${isDarkMode ? 'bg-violet-500/20' : style.light}
        `}>
          <Icon size={22} className={isDarkMode ? 'text-violet-400' : style.text} />
        </div>
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{value}</p>
          {subtitle && <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

// ===========================================
// MAIN BUDGET COMPONENT
// ===========================================

const Budget = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUser();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Budget state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [totalBudget, setTotalBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [categories, setCategories] = useState([]);
  const [spending, setSpending] = useState({});
  const [analysis, setAnalysis] = useState(null);
  
  // Dropdown state for adding category budgets
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Month names
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    fetchBudgetData();
  }, [selectedMonth, selectedYear]);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      
      // Fetch budget and categories
      const budgetRes = await fetch(`${API_BASE}/budgets?month=${selectedMonth}&year=${selectedYear}`);
      const budgetData = await budgetRes.json();
      
      // Fetch savings analysis
      const analysisRes = await fetch(`${API_BASE}/budgets/analysis?month=${selectedMonth}&year=${selectedYear}`);
      const analysisData = await analysisRes.json();

      // Set categories (expense categories only)
      const expenseCategories = budgetData.categories || [];
      setCategories(expenseCategories);
      setSpending(budgetData.spending || {});

      // Set existing budget data
      if (budgetData.budget) {
        setTotalBudget(budgetData.budget.totalBudget || 0);
        const budgetMap = {};
        budgetData.budget.categoryBudgets?.forEach(cb => {
          budgetMap[cb.categoryName] = cb.amount;
        });
        setCategoryBudgets(budgetMap);
      } else {
        setTotalBudget(0);
        setCategoryBudgets({});
      }

      setAnalysis(analysisData);
    } catch (error) {
      console.error("Failed to fetch budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryBudgetChange = (categoryName, amount) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryName]: amount
    }));
  };

  const handleAddCategoryBudget = () => {
    if (selectedCategory && newBudgetAmount) {
      setCategoryBudgets(prev => ({
        ...prev,
        [selectedCategory]: parseFloat(newBudgetAmount) || 0
      }));
      setSelectedCategory('');
      setNewBudgetAmount('');
      setIsDropdownOpen(false);
    }
  };

  const handleDeleteCategoryBudget = (categoryName) => {
    setCategoryBudgets(prev => {
      const updated = { ...prev };
      delete updated[categoryName];
      return updated;
    });
  };

  // Get categories that don't have a budget yet
  const availableCategories = categories.filter(cat => !categoryBudgets.hasOwnProperty(cat.name));
  
  // Get categories that have budgets set
  const budgetedCategories = Object.keys(categoryBudgets).filter(name => categoryBudgets[name] > 0);

  const handleSaveBudget = async () => {
    try {
      setSaving(true);
      
      // Convert categoryBudgets object to array format
      const categoryBudgetsArray = Object.entries(categoryBudgets).map(([name, amount]) => ({
        categoryName: name,
        amount: amount
      }));

      await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear,
          totalBudget,
          categoryBudgets: categoryBudgetsArray
        })
      });

      // Refresh analysis
      await fetchBudgetData();
    } catch (error) {
      console.error("Failed to save budget:", error);
    } finally {
      setSaving(false);
    }
  };

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        setSelectedMonth(12);
        setSelectedYear(prev => prev - 1);
      } else {
        setSelectedMonth(prev => prev - 1);
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1);
        setSelectedYear(prev => prev + 1);
      } else {
        setSelectedMonth(prev => prev + 1);
      }
    }
  };

  // Calculate totals
  const allocatedBudget = Object.values(categoryBudgets).reduce((sum, val) => sum + (val || 0), 0);
  const totalSpent = Object.values(spending).reduce((sum, val) => sum + (val || 0), 0);
  // Smart Savings = Income - Total Expense - Total Budget
  const smartSavings = (analysis?.totalIncome || 0) - totalSpent - totalBudget;

  // Helper functions
  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const formatCurrency = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
    return `₹${amount?.toLocaleString() || 0}`;
  };

  // Sidebar navigation items
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: List, label: "Transactions", path: "/all-transactions" },
    { icon: Target, label: "Budget", path: "/budget" }
  ];

  return (
    <div className={`w-full min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-[#f8f7fc]'}`}>

      {/* MOBILE HEADER */}
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

      {/* SIDEBAR */}
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
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-violet-100'}`}>
          <div className="space-y-1">
            <Link to="/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'}`}>
              <Settings size={18} />
              Settings
            </Link>
            <button onClick={toggleTheme} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-violet-700 hover:bg-violet-50'}`}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* User Avatar */}
          <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-violet-100'}`}>
            <Link to="/profile" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm overflow-hidden bg-linear-to-br from-violet-400 to-purple-500 text-white">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name || "User")
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{user?.name || "User"}</p>
                <p className={`text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email || "user@email.com"}</p>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Monthly Budget
                </h1>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Set your budget and track your spending
                </p>
              </div>

              {/* Month Selector */}
              <div className={`
                flex items-center gap-2 px-4 py-2 rounded-xl
                ${isDarkMode ? 'bg-slate-800' : 'bg-white shadow-sm'}
              `}>
                <button 
                  onClick={() => changeMonth('prev')}
                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-violet-100 text-slate-500'}`}
                >
                  <ChevronLeft size={18} />
                </button>
                <span className={`font-semibold min-w-24 text-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {monthNames[selectedMonth - 1]} {selectedYear}
                </span>
                <button 
                  onClick={() => changeMonth('next')}
                  className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-violet-100 text-slate-500'}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className={`animate-spin ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} size={32} />
            </div>
          ) : (
            <>
              {/* Total Monthly Budget Input */}
              <div className={`
                rounded-2xl p-6 mb-6
                ${isDarkMode ? 'bg-slate-800/80' : 'bg-white shadow-sm'}
              `}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-linear-to-br from-violet-500 to-purple-600 text-white">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Total Monthly Budget</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Set your overall spending limit</p>
                    </div>
                  </div>
                  <div className="flex-1 sm:max-w-xs sm:ml-auto">
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>₹</span>
                      <input
                        type="number"
                        value={totalBudget || ''}
                        onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                        placeholder="Enter budget..."
                        className={`
                          w-full pl-10 pr-4 py-3 rounded-xl text-lg font-semibold
                          transition-all duration-200 outline-none
                          ${isDarkMode 
                            ? 'bg-slate-700/50 text-white placeholder-slate-500 border border-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20' 
                            : 'bg-violet-50 text-slate-800 placeholder-slate-400 border border-violet-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20'}
                        `}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Smart Savings Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <SavingsCard
                  title="Monthly Income"
                  value={formatCurrency(analysis?.totalIncome || 0)}
                  icon={TrendingUp}
                  color="emerald"
                  isDarkMode={isDarkMode}
                />
                <SavingsCard
                  title="Allocated Budget"
                  value={formatCurrency(allocatedBudget)}
                  subtitle={`of ${formatCurrency(totalBudget)}`}
                  icon={Wallet}
                  color="violet"
                  isDarkMode={isDarkMode}
                />
                <SavingsCard
                  title="Total Spent"
                  value={formatCurrency(totalSpent)}
                  subtitle={allocatedBudget > 0 ? `${Math.round((totalSpent / allocatedBudget) * 100)}% of budget` : undefined}
                  icon={ShoppingCart}
                  color="rose"
                  isDarkMode={isDarkMode}
                />
                <SavingsCard
                  title="Smart Savings"
                  value={`₹${smartSavings.toLocaleString()}`}
                  subtitle={analysis?.totalIncome > 0 ? `Income - Expense - Budget` : undefined}
                  icon={Sparkles}
                  color={smartSavings >= 0 ? "emerald" : "rose"}
                  isDarkMode={isDarkMode}
                  isMain
                />
              </div>

              {/* Savings Insights */}
              {(analysis?.totalIncome > 0 || totalBudget > 0) && (
                <div className={`
                  rounded-2xl p-6 mb-8 border-l-4 border-l-violet-500
                  ${isDarkMode ? 'bg-slate-800/80' : 'bg-white shadow-sm'}
                `}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                      <PiggyBank size={20} className={isDarkMode ? 'text-violet-400' : 'text-violet-600'} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Smart Savings Analysis</h3>
                      <div className="space-y-2">
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          <strong>Formula:</strong> Income (₹{(analysis?.totalIncome || 0).toLocaleString()}) - Expense (₹{totalSpent.toLocaleString()}) - Budget (₹{totalBudget.toLocaleString()})
                        </p>
                        {smartSavings >= 0 ? (
                          <p className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                            <CheckCircle size={16} />
                            Great! You can save <strong>₹{smartSavings.toLocaleString()}</strong> after expenses and planned budget.
                          </p>
                        ) : (
                          <p className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                            <AlertCircle size={16} />
                            You're <strong>₹{Math.abs(smartSavings).toLocaleString()}</strong> over your income. Consider reducing your budget.
                          </p>
                        )}
                        
                        {allocatedBudget !== totalBudget && totalBudget > 0 && (
                          <p className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                            <AlertCircle size={16} className="inline mr-1" />
                            Category budgets (₹{allocatedBudget.toLocaleString()}) don't match total budget (₹{totalBudget.toLocaleString()})
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Category Budgets - Add New */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    Allocate Budget by Category
                  </h2>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {budgetedCategories.length} of {categories.length} categories
                  </span>
                </div>

                {/* Add Category Budget Form */}
                <div className={`
                  rounded-2xl p-5 mb-4
                  ${isDarkMode ? 'bg-slate-800/80' : 'bg-white shadow-sm'}
                `}>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Category Dropdown */}
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${isDarkMode 
                            ? 'bg-slate-700/50 text-white border border-slate-600 hover:border-violet-500' 
                            : 'bg-violet-50 text-slate-800 border border-violet-200 hover:border-violet-400'}
                        `}
                      >
                        <span className={selectedCategory ? '' : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}>
                          {selectedCategory || 'Select Category...'}
                        </span>
                        <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className={`
                          absolute z-20 w-full mt-2 py-2 rounded-xl shadow-xl max-h-60 overflow-y-auto
                          ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-violet-100'}
                        `}>
                          {availableCategories.length > 0 ? (
                            availableCategories.map((cat) => {
                              const Icon = categoryIcons[cat.name] || CreditCard;
                              const color = categoryColors[cat.name] || "#6b7280";
                              return (
                                <button
                                  key={cat._id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(cat.name);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`
                                    w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium
                                    transition-colors
                                    ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-violet-50 text-slate-800'}
                                  `}
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: isDarkMode ? `${color}20` : `${color}15` }}
                                  >
                                    <Icon size={16} style={{ color }} />
                                  </div>
                                  {cat.name}
                                </button>
                              );
                            })
                          ) : (
                            <p className={`px-4 py-2 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              All categories have budgets
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Budget Amount Input */}
                    <div className="relative sm:w-48">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>₹</span>
                      <input
                        type="number"
                        value={newBudgetAmount}
                        onChange={(e) => setNewBudgetAmount(e.target.value)}
                        placeholder="Amount"
                        className={`
                          w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium
                          transition-all duration-200 outline-none
                          ${isDarkMode 
                            ? 'bg-slate-700/50 text-white placeholder-slate-500 border border-slate-600 focus:border-violet-500' 
                            : 'bg-violet-50 text-slate-800 placeholder-slate-400 border border-violet-200 focus:border-violet-400'}
                        `}
                      />
                    </div>

                    {/* Add Button */}
                    <button
                      type="button"
                      onClick={handleAddCategoryBudget}
                      disabled={!selectedCategory || !newBudgetAmount}
                      className={`
                        flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white
                        transition-all duration-200
                        bg-linear-to-r from-violet-500 to-purple-600
                        hover:from-violet-600 hover:to-purple-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                </div>

                {/* Existing Category Budgets */}
                {budgetedCategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {budgetedCategories.map((categoryName) => (
                      <CategoryBudgetCard
                        key={categoryName}
                        categoryName={categoryName}
                        budget={categoryBudgets[categoryName] || 0}
                        spent={spending[categoryName] || 0}
                        onChange={handleCategoryBudgetChange}
                        onDelete={handleDeleteCategoryBudget}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`
                    rounded-2xl p-8 text-center
                    ${isDarkMode ? 'bg-slate-800/80' : 'bg-white shadow-sm'}
                  `}>
                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-violet-500/20' : 'bg-violet-100'}`}>
                      <Target size={32} className={isDarkMode ? 'text-violet-400' : 'text-violet-600'} />
                    </div>
                    <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>No Category Budgets Set</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Use the dropdown above to add category-wise budget allocations.
                    </p>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveBudget}
                  disabled={saving}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
                    transition-all duration-200
                    bg-linear-to-r from-violet-500 to-purple-600
                    hover:from-violet-600 hover:to-purple-700
                    hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  `}
                >
                  {saving ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Budget
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Budget;
