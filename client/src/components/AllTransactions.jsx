import React, { useState, useRef, useEffect } from "react";
import {
  Search, Filter, ChevronDown, MoreHorizontal, Plus, Download, Trash2, Edit3,
  ShoppingCart, Car, CreditCard, Utensils, Briefcase, Plane,
  Home, List, Target, LogOut, Settings, Sun, Moon, Bell,
  Calendar, X, TrendingUp, ArrowUpRight, ArrowDownLeft,
  Zap, Film, Heart, Gift, Gamepad2, Wifi, Phone, CalendarDays
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";

const API_BASE = "http://localhost:3000/api";

// Category configurations
const categoryConfig = {
  "Shopping": { icon: ShoppingCart, color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-50", bgDark: "bg-purple-900/40" },
  "Food": { icon: Utensils, color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50", bgDark: "bg-orange-900/40" },
  "Transport": { icon: Car, color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-50", bgDark: "bg-blue-900/40" },
  "Travel": { icon: Plane, color: "bg-cyan-500", textColor: "text-cyan-600", bgLight: "bg-cyan-50", bgDark: "bg-cyan-900/40" },
  "Bills": { icon: Zap, color: "bg-amber-500", textColor: "text-amber-600", bgLight: "bg-amber-50", bgDark: "bg-amber-900/40" },
  "Entertainment": { icon: Film, color: "bg-pink-500", textColor: "text-pink-600", bgLight: "bg-pink-50", bgDark: "bg-pink-900/40" },
  "Healthcare": { icon: Heart, color: "bg-red-500", textColor: "text-red-600", bgLight: "bg-red-50", bgDark: "bg-red-900/40" },
  "Salary": { icon: Briefcase, color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-50", bgDark: "bg-emerald-900/40" },
  "Investment": { icon: TrendingUp, color: "bg-green-500", textColor: "text-green-600", bgLight: "bg-green-50", bgDark: "bg-green-900/40" },
  "Gifts": { icon: Gift, color: "bg-rose-500", textColor: "text-rose-600", bgLight: "bg-rose-50", bgDark: "bg-rose-900/40" },
  "Gaming": { icon: Gamepad2, color: "bg-indigo-500", textColor: "text-indigo-600", bgLight: "bg-indigo-50", bgDark: "bg-indigo-900/40" },
  "Internet": { icon: Wifi, color: "bg-teal-500", textColor: "text-teal-600", bgLight: "bg-teal-50", bgDark: "bg-teal-900/40" },
  "Phone": { icon: Phone, color: "bg-violet-500", textColor: "text-violet-600", bgLight: "bg-violet-50", bgDark: "bg-violet-900/40" },
  "Other": { icon: CreditCard, color: "bg-gray-500", textColor: "text-gray-600", bgLight: "bg-gray-50", bgDark: "bg-gray-800/40" }
};

// Generate last 12 months
const generateMonthOptions = () => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    // Use local date format to avoid timezone issues
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      value,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
  }
  return months;
};

const DropdownFilter = ({ label, value, options, onChange, icon: Icon, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border font-medium text-sm transition-colors min-w-36 ${isDarkMode
          ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-600'
          : 'bg-white border-slate-200/60 text-slate-700 hover:border-slate-300'
          }`}
      >
        {Icon && <Icon size={14} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />}
        <span className="flex-1 text-left truncate">{selectedOption?.label || label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full min-w-48 rounded-lg border shadow-lg z-50 overflow-hidden ${isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
          }`}>
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm font-medium transition-colors ${value === option.value
                  ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900')
                  : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-50')
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AllTransactions = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("thisMonth");
  const [selectedDate, setSelectedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "Shopping",
    amount: "",
    type: "expense",
    method: "UPI",
    date: new Date().toISOString().split('T')[0]
  });

  // Fetch transactions from backend
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/transactions`);
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use local date to match with transaction filtering
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const monthOptions = [
    { value: "thisMonth", label: "This Month" },
    { value: "All", label: "All Time" },
    ...generateMonthOptions()
  ];

  const categoryOptions = [
    { value: "All", label: "All Categories" },
    ...Object.keys(categoryConfig).map(cat => ({ value: cat, label: cat }))
  ];

  const methodOptions = [
    { value: "All", label: "All Methods" },
    { value: "UPI", label: "UPI" },
    { value: "Card", label: "Card" },
    { value: "Cash", label: "Cash" },
    { value: "Bank Transfer", label: "Bank Transfer" }
  ];

  const typeOptions = [
    { value: "All", label: "All Types" },
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" }
  ];

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const filteredTransactions = transactions.filter(tx => {
    const txDateObj = new Date(tx.date);
    // Use local date to avoid timezone issues
    const txYear = txDateObj.getFullYear();
    const txMonthNum = txDateObj.getMonth() + 1; // 0-indexed
    const txDay = txDateObj.getDate();
    const txMonth = `${txYear}-${String(txMonthNum).padStart(2, '0')}`;
    const txDate = `${txYear}-${String(txMonthNum).padStart(2, '0')}-${String(txDay).padStart(2, '0')}`;
    
    const matchesSearch = tx.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
    const matchesMethod = selectedMethod === "All" || 
      tx.paymentmethod?.toLowerCase() === selectedMethod.toLowerCase();
    const matchesType = selectedType === "All" || tx.type === selectedType;
    
    let matchesMonth = true;
    if (selectedMonth === "thisMonth") {
      matchesMonth = txMonth === currentMonth;
    } else if (selectedMonth !== "All") {
      matchesMonth = txMonth === selectedMonth;
    }
    
    const matchesDate = !selectedDate || txDate === selectedDate;
    
    return matchesSearch && matchesCategory && matchesMethod && matchesType && matchesMonth && matchesDate;
  });

  const totalIncome = filteredTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedMethod("All");
    setSelectedType("All");
    setSelectedMonth("thisMonth");
    setSelectedDate("");
    setSearchTerm("");
  };

  const hasActiveFilters = selectedCategory !== "All" || selectedMethod !== "All" || selectedType !== "All" || selectedMonth !== "thisMonth" || selectedDate || searchTerm;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      category: "Shopping",
      amount: "",
      type: "expense",
      method: "UPI",
      date: new Date().toISOString().split('T')[0]
    });
    setEditingTransaction(null);
  };

  const handleEdit = (tx) => {
    const txDate = new Date(tx.date);
    const dateStr = `${txDate.getFullYear()}-${String(txDate.getMonth() + 1).padStart(2, '0')}-${String(txDate.getDate()).padStart(2, '0')}`;
    setForm({
      name: tx.name,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      method: tx.paymentmethod || "UPI",
      date: dateStr
    });
    setEditingTransaction(tx);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTransaction 
        ? `${API_BASE}/transactions/${editingTransaction._id}`
        : `${API_BASE}/transactions`;
      const method = editingTransaction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        await fetchTransactions();
        resetForm();
        setShowModal(false);
      }
    } catch (error) {
      console.error(editingTransaction ? "Failed to update transaction:" : "Failed to create transaction:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
      await fetchTransactions();
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      alert("No transactions to export");
      return;
    }

    const headers = ["Name", "Category", "Amount", "Type", "Method", "Date"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(tx => 
        [
          `"${tx.name}"`,
          tx.category,
          tx.amount,
          tx.type,
          tx.paymentmethod,
          new Date(tx.date).toISOString().split('T')[0]
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-[#fafafa]'}`}>

      {/* MOBILE HEADER */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/95 border-slate-800 backdrop-blur-xl' : 'bg-white border-slate-200/60'}`}>
        <h1 className="flex items-center gap-2 font-semibold">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-bold">₹</div>
          <span className={`tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ExpenseTrack</span>
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
          <List size={20} />
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r transition-all duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode
        ? 'bg-slate-900 border-slate-800'
        : 'bg-white border-slate-200/60'}`}>

        <div className="p-5 flex flex-col h-full">
          <h1 className="hidden md:flex text-lg font-semibold mb-8 items-center gap-2.5">
            <div className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
              ₹
            </div>
            <span className={`tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>ExpenseTrack</span>
          </h1>

          <nav className="flex flex-col flex-1">
            <ul className="space-y-1">
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <Home size={18} />
                  Dashboard
                </Link>
              </li>
              <li className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-sm ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white'}`}>
                <List size={18} />
                Transactions
              </li>
              <li>
                <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <Target size={18} />
                  Goals
                </div>
              </li>
            </ul>

            <div className={`pt-5 border-t mt-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-200/60'}`}>
              <ul className="space-y-1">
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/profile" className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
                    <Settings size={18} />
                    Settings
                  </Link>
                </li>
                <li className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-500 hover:bg-rose-50'}`}>
                  <LogOut size={18} />
                  Logout
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen">
        {/* Top Header */}
        <div className={`px-5 md:px-6 py-4 flex items-center justify-between border-b sticky top-0 z-30 ${isDarkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur-xl' : 'bg-white/95 border-slate-200/60'}`}>
          <div />
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative cursor-pointer">
              <Bell size={20} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </div>
            <Link to="/profile">
              <div className={`w-9 h-9 rounded-lg overflow-hidden ring-2 ${isDarkMode ? 'ring-slate-700' : 'ring-slate-200'}`}>
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-xs font-medium">
                    {getInitials(user?.name || "User")}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>

        <div className="p-5 md:p-6 space-y-5">
          {/* Page Header */}
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className={`text-xl md:text-2xl font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Transactions
              </h2>
              <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                Manage your financial records
              </p>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              <Plus size={16} />
              Add New
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`rounded-xl p-4 border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200/60'}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Income</p>
              <p className="text-xl font-semibold text-emerald-600">₹{totalIncome.toLocaleString()}</p>
            </div>
            <div className={`rounded-xl p-4 border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200/60'}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Expense</p>
              <p className="text-xl font-semibold text-rose-600">₹{totalExpense.toLocaleString()}</p>
            </div>
            <div className={`rounded-xl p-4 border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200/60'}`}>
              <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Balance</p>
              <p className={`text-xl font-semibold ${totalIncome - totalExpense >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{(totalIncome - totalExpense).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className={`rounded-xl p-4 border ${isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200/60'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Filters</span>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600">
                  <X size={12} /> Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200/60'}`}>
                <Search size={14} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`bg-transparent outline-none flex-1 text-sm ${isDarkMode ? 'text-white placeholder-slate-600' : 'text-slate-700 placeholder-slate-400'}`}
                />
              </div>

              <DropdownFilter label="Month" value={selectedMonth} options={monthOptions} onChange={setSelectedMonth} icon={Calendar} isDarkMode={isDarkMode} />
              <DropdownFilter label="Category" value={selectedCategory} options={categoryOptions} onChange={setSelectedCategory} icon={Target} isDarkMode={isDarkMode} />
              <DropdownFilter label="Method" value={selectedMethod} options={methodOptions} onChange={setSelectedMethod} icon={CreditCard} isDarkMode={isDarkMode} />
              <DropdownFilter label="Type" value={selectedType} options={typeOptions} onChange={setSelectedType} icon={TrendingUp} isDarkMode={isDarkMode} />

              {/* Date Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border font-medium text-sm transition-colors ${selectedDate
                    ? (isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-900')
                    : (isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-400' : 'bg-white border-slate-200/60 text-slate-500')
                    }`}
                >
                  <CalendarDays size={14} />
                  <span className="truncate">{selectedDate || "Pick Date"}</span>
                </button>
                {showDatePicker && (
                  <div className={`absolute top-full left-0 mt-2 p-3 rounded-lg border shadow-lg z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => { setSelectedDate(e.target.value); setShowDatePicker(false); }}
                      className={`px-3 py-2 rounded-lg border text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    />
                    {selectedDate && (
                      <button onClick={() => { setSelectedDate(""); setShowDatePicker(false); }} className="w-full mt-2 text-xs text-rose-500 font-medium">
                        Clear Date
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white border-slate-200/60'}`}>
            <div className={`px-4 py-3 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <span className={`text-xs font-medium uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                {loading ? "Loading..." : `${filteredTransactions.length} Records`}
              </span>
              <button onClick={exportToCSV} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                <Download size={12} />
                Export
              </button>
            </div>

            <div className={`divide-y ${isDarkMode ? 'divide-slate-700/30' : 'divide-slate-100'}`}>
              {loading ? (
                <div className="px-5 py-12 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-slate-400 border-t-transparent rounded-full mx-auto" />
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => {
                  const config = categoryConfig[tx.category] || categoryConfig["Other"];
                  const IconComponent = config.icon;

                  return (
                    <div key={tx._id} className={`px-4 py-3.5 flex items-center gap-3.5 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}>
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? config.bgDark : config.bgLight} ${isDarkMode ? 'text-white' : config.textColor}`}>
                        <IconComponent size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${isDarkMode ? config.bgDark + ' text-slate-300' : config.bgLight + ' ' + config.textColor}`}>
                            {tx.category}
                          </span>
                          <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{tx.paymentmethod}</span>
                          <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{formatDate(tx.date)}</span>
                        </div>
                      </div>

                      <p className={`text-sm font-semibold shrink-0 ${tx.type === "income" ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === "income" ? '+' : '-'}₹{tx.amount.toLocaleString()}
                      </p>

                      <button onClick={() => handleEdit(tx)} className={`p-2 rounded-lg transition-colors shrink-0 ${isDarkMode ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
                        <Edit3 size={14} />
                      </button>

                      <button onClick={() => handleDelete(tx._id)} className={`p-2 rounded-lg transition-colors shrink-0 ${isDarkMode ? 'text-slate-500 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="px-5 py-12 text-center">
                  <div className={`w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                    <List size={20} />
                  </div>
                  <p className={`font-medium text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>No transactions</p>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Click "Add New" to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`rounded-xl shadow-xl w-full max-w-lg overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                  {editingTransaction ? <Edit3 size={18} /> : <Plus size={18} />}
                </div>
                <h3 className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</h3>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={`text-xs font-medium uppercase tracking-wide block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Transaction name"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600 focus:border-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium uppercase tracking-wide block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    {Object.keys(categoryConfig).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-medium uppercase tracking-wide block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Amount</label>
                  <div className="relative">
                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>₹</span>
                    <input name="amount" type="number" value={form.amount} onChange={handleChange} required min="1" placeholder="0"
                      className={`w-full border rounded-lg pl-7 pr-3 py-2.5 text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-medium uppercase tracking-wide block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Date</label>
                  <input name="date" type="date" value={form.date} onChange={handleChange} required
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>

                <div>
                  <label className={`text-xs font-medium uppercase tracking-wide block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["expense", "income"].map(t => (
                      <button key={t} type="button" onClick={() => setForm(prev => ({ ...prev, type: t }))}
                        className={`py-2 rounded-lg text-xs font-medium uppercase transition-colors ${form.type === t
                          ? (t === "income" ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white')
                          : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className={`text-xs font-medium uppercase tracking-wide block mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Method</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["UPI", "Card", "Cash", "Bank Transfer"].map(m => (
                      <button key={m} type="button" onClick={() => setForm(prev => ({ ...prev, method: m }))}
                        className={`py-2 rounded-lg text-[10px] font-medium uppercase transition-colors ${form.method === m
                          ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white')
                          : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className={`px-4 py-2 text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}>
                  Cancel
                </button>
                <button type="submit" className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  {editingTransaction ? 'Save' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTransactions;
