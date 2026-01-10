import React, { useState } from "react";
import {
  Search, Filter, Plus, ChevronDown, MoreHorizontal,
  ShoppingCart, Car, CreditCard, Apple, Briefcase,
  Home, List, Target, LogOut, Settings, Sun, Moon, Bell,
  MoreVertical, CheckSquare, Square
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useUser } from "../context/UserContext.jsx";

const initialTransactions = [];

const StatCard = ({ label, value, delta, tone, isDarkMode }) => (
  <div className={`card-premium p-7 flex flex-col gap-2 min-w-[200px]`}>
    <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${isDarkMode ? 'text-purple-400' : 'text-zinc-500'}`}>{label}</span>
    <span className={`text-3xl md:text-4xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>{value}</span>
    {delta && (
      <div className={`mt-2 flex items-center gap-2 text-[10px] font-bold ${tone === "up" ? "text-emerald-500" : "text-amber-500"}`}>
        <span className={`px-2 py-0.5 rounded-full ${tone === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}`}>
          {delta}
        </span>
      </div>
    )}
  </div>
);

const Transactioncard = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useUser();
  const [items, setItems] = useState(initialTransactions);
  const [showModal, setShowModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [form, setForm] = useState({
    name: "",
    category: "",
    amount: "",
    method: "UPI",
    date: ""
  });

  const getInitials = (name) => {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", category: "", amount: "", method: "UPI", date: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNumber = Number(form.amount) || 0;
    const newTx = {
      id: Date.now(),
      name: form.name || "Untitled",
      category: form.category || "Uncategorized",
      amount: amountNumber,
      method: form.method,
      date: new Date(form.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: <ShoppingCart size={18} />
    };
    setItems((prev) => [newTx, ...prev]);
    resetForm();
    setShowModal(false);
  };

  const filteredItems = items.filter(it => {
    const matchesSearch = it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === "All" || it.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredItems.map(it => it.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(r => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row ${isDarkMode ? 'dark bg-[#0a0514] text-white' : 'bg-[#fdfbff] text-indigo-950'}`}>

      {/* ---------------- MOBILE HEADER ---------------- */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b sticky top-0 z-40 ${isDarkMode ? 'bg-purple-950/80 border-purple-800 backdrop-blur-md' : 'bg-white border-purple-50 shadow-sm'}`}>
        <h1 className="flex items-center gap-2 font-black italic">
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 text-white text-sm">₹</div>
          <span className="tracking-tighter">ExpenseTrack</span>
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600">
          <List size={24} />
        </button>
      </div>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode
        ? 'bg-purple-950/95 border-purple-800/50 text-white backdrop-blur-xl'
        : 'bg-white border-purple-50 text-indigo-900 shadow-2xl md:shadow-none'}`}>

        <div className="p-8 flex flex-col h-full">
          <h1 className="hidden md:flex text-2xl font-black mb-12 items-center gap-3">
            <div className={`w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg font-black italic transform -rotate-12 ${isDarkMode ? 'bg-white text-purple-700' : 'bg-linear-to-br from-purple-600 to-indigo-600 text-white shadow-purple-500/30'}`}>
              ₹
            </div>
            <span className="tracking-tighter italic text-2xl">ExpenseTrack</span>
          </h1>

          <nav className="flex flex-col space-y-8 flex-1">
            <ul className="space-y-2">
              <li onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/" className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-purple-600 hover:bg-purple-50'}`}>
                  <Home size={20} />
                  Dashboard
                </Link>
              </li>
              <li className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 shadow-lg ${isDarkMode ? 'bg-white text-purple-700' : 'bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-purple-600/20'}`}>
                <List size={20} />
                Transactions
              </li>
              <li>
                <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-purple-600 hover:bg-purple-50'}`}>
                  <CreditCard size={20} />
                  Expenses
                </div>
              </li>
              <li>
                <div className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-purple-600 hover:bg-purple-50'}`}>
                  <Target size={20} />
                  Goals
                </div>
              </li>
            </ul>

            <div className="pt-8 border-t border-purple-800/20 dark:border-purple-800/30 mt-auto">
              <ul className="space-y-2">
                <li onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/profile" className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:translate-x-1 ${isDarkMode ? 'text-purple-200 hover:text-white hover:bg-white/5' : 'text-zinc-500 hover:text-purple-600 hover:bg-purple-50'}`}>
                    <Settings size={20} />
                    Settings
                  </Link>
                </li>
                <li className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all duration-300 hover:translate-x-1 ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-500 hover:bg-rose-50'}`}>
                  <LogOut size={20} />
                  Logout
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 min-h-screen">

        {/* Top Header */}
        <div className={`px-10 py-6 flex items-center justify-between border-b ${isDarkMode ? 'bg-purple-950/20 border-purple-900/50 backdrop-blur-md' : 'bg-white/80 border-purple-50 backdrop-blur-md'}`}>
          <div className="flex items-center gap-2">
            {/* Unnecessary button removed */}
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-white text-purple-700 shadow-xl' : 'bg-purple-50 text-purple-600 shadow-sm border border-purple-100'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="relative cursor-pointer group">
              <Bell size={24} className={isDarkMode ? 'text-purple-200' : 'text-zinc-400 group-hover:text-purple-600'} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </div>
            <div className={`w-11 h-11 rounded-2xl overflow-hidden border-2 shadow-sm ${isDarkMode ? 'border-purple-400' : 'border-purple-100'}`}>
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="User" />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {getInitials(user?.name || "User")}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-12">

          {/* Section Header */}
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-indigo-950 dark:text-white">Transactions</h2>
              <div className={`flex items-center gap-4 w-full md:w-96 bg-white rounded-2xl shadow-sm border border-purple-100 px-5 py-3 transition-all focus-within:ring-4 focus-within:ring-purple-500/10 focus-within:border-purple-300 ${isDarkMode ? 'bg-purple-900/10 border-purple-800/40' : ''}`}>
                <Search size={20} className="text-purple-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm font-bold placeholder:text-zinc-400 text-indigo-950 dark:text-white"
                />
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-premium flex items-center gap-3 w-full md:w-auto justify-center md:justify-start transform md:scale-110"
            >
              <Plus size={20} /> <span className="text-base">Add Entry</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <StatCard label="Total Capital" value="₹12,545" delta="+3.2% increase" tone="up" isDarkMode={isDarkMode} />
            <StatCard label="Awaiting" value="₹1,220" delta="1 active" tone="down" isDarkMode={isDarkMode} />
            <StatCard label="Verified" value="₹10,375" delta="+6 cleared" tone="up" isDarkMode={isDarkMode} />
            <StatCard label="Reversed" value="₹950" delta="None today" tone="down" isDarkMode={isDarkMode} />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              {["All", "UPI", "Card", "Cash"].map(method => (
                <button
                  key={method}
                  onClick={() => setFilterMethod(method)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-2xl border font-bold text-sm transition-all ${filterMethod === method
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : (isDarkMode ? 'bg-purple-900/20 border-purple-800 text-purple-200' : 'bg-white border-purple-100 text-zinc-600 shadow-sm hover:border-purple-300')}`}
                >
                  {method}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm ${isDarkMode ? 'bg-purple-900/20 border-purple-800 text-purple-200' : 'bg-white border-purple-100 text-zinc-600 shadow-sm'}`}>
                <span className="text-zinc-400">Apr 11, 2021</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span className="text-zinc-400">Sep 1, 2023</span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="card-premium overflow-hidden !cursor-default !hover:translate-y-0 !shadow-none ring-1 ring-purple-100 dark:ring-purple-800/30">
            <div className={`px-10 py-6 flex items-center gap-4 border-b ${isDarkMode ? 'border-purple-800/40 bg-purple-900/20' : 'bg-purple-50/30 border-purple-100'}`}>
              <div className="bg-white dark:bg-purple-900/40 p-2 rounded-lg shadow-sm">
                <Search size={18} className="text-purple-500" />
              </div>
              <input
                type="text"
                placeholder="Filter current view..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm font-bold placeholder:text-zinc-400"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[800px]">
                <thead>
                  <tr className={`border-b ${isDarkMode ? 'border-purple-800/40' : 'border-purple-100'}`}>
                    <th className="px-10 py-6 w-12">
                      <div className="cursor-pointer transform hover:scale-110 transition-transform" onClick={toggleSelectAll}>
                        {selectedRows.length === filteredItems.length && filteredItems.length > 0 ? <CheckSquare size={20} className="text-purple-600" /> : <Square size={20} className="text-zinc-300" />}
                      </div>
                    </th>
                    <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-zinc-400">Transaction</th>
                    <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-zinc-400">Category</th>
                    <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-zinc-400">Method</th>
                    <th className="px-8 py-6 font-black uppercase tracking-widest text-[10px] text-zinc-400">Amount</th>
                    <th className="px-8 py-6 w-12"></th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-purple-800/40' : 'divide-purple-50'}`}>
                  {filteredItems.length > 0 ? filteredItems.map((tx) => (
                    <tr
                      key={tx.id}
                      className={`group transition-all duration-300 ${selectedRows.includes(tx.id) ? (isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50') : (isDarkMode ? 'hover:bg-purple-900/10' : 'hover:bg-purple-50/40')}`}
                    >
                      <td className="px-10 py-6">
                        <div className="cursor-pointer transform hover:scale-110 transition-transform" onClick={() => toggleSelectRow(tx.id)}>
                          {selectedRows.includes(tx.id) ? <CheckSquare size={20} className="text-purple-600" /> : <Square size={20} className="text-zinc-300" />}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-purple-900/40 border-purple-700 text-purple-200' : 'bg-white border-purple-100 text-purple-600'}`}>
                            {tx.icon}
                          </div>
                          <div>
                            <p className="font-black text-base text-indigo-950 dark:text-white leading-tight">{tx.name}</p>
                            <p className="text-[10px] uppercase font-black text-zinc-400 mt-1 tracking-wider">{tx.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-zinc-600 dark:text-zinc-400">{tx.category}</td>
                      <td className="px-8 py-6 font-bold text-zinc-600 dark:text-zinc-400">{tx.method}</td>
                      <td className="px-8 py-6 font-black text-lg text-rose-500">₹{tx.amount.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <button className="p-2 rounded-xl text-zinc-400 hover:text-purple-600 hover:bg-purple-50 transition-all">
                          <MoreHorizontal size={22} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="px-10 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-zinc-400">
                          <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-200">
                            <List size={32} />
                          </div>
                          <p className="font-extrabold uppercase tracking-widest text-sm">No Transactions Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={`px-10 py-6 flex items-center justify-between border-t ${isDarkMode ? 'border-purple-800/40' : 'border-purple-100'}`}>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-loose">
                Showing {filteredItems.length} of {items.length} Transactions
              </p>
              <div className="flex items-center gap-2">
                <button className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isDarkMode ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/40' : 'bg-purple-50 text-purple-400 hover:bg-purple-100'}`}>
                  &lt;
                </button>
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black bg-linear-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20">
                  1
                </button>
                <button className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${isDarkMode ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/40' : 'bg-white border border-purple-100 text-purple-600 hover:border-purple-300'}`}>
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal - Simplified & Stylish with Icons */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-purple-950/60 backdrop-blur-md">
          <div className={`rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden border ${isDarkMode ? 'bg-[#0a0514] border-purple-800/50' : 'bg-white border-purple-100'}`}>
            <div className={`flex items-center justify-between px-10 py-8 border-b ${isDarkMode ? 'border-purple-800/50' : 'border-purple-50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
                  <Plus size={32} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-purple-500 font-black mb-1">New Entry</p>
                  <h3 className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-indigo-950'}`}>Add Transaction</h3>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center text-purple-500 hover:scale-110 transition-all duration-300"
              >
                <Plus size={28} className="rotate-45" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-500">
                    <List size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Name</label>
                  </div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all ${isDarkMode ? 'bg-purple-900/20 border-purple-800 text-white placeholder-purple-300/10' : 'bg-purple-50/30 border-purple-100'}`}
                    placeholder="e.g. Starbucks"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Target size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Category</label>
                  </div>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all ${isDarkMode ? 'bg-purple-900/20 border-purple-800 text-white placeholder-purple-300/10' : 'bg-purple-50/30 border-purple-100'}`}
                    placeholder="e.g. Drinks"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-500">
                    <CreditCard size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Amount</label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-purple-500 text-sm">₹</span>
                    <input
                      name="amount"
                      type="number"
                      value={form.amount}
                      onChange={handleChange}
                      required
                      className={`w-full border rounded-2xl pl-9 pr-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all ${isDarkMode ? 'bg-purple-900/20 border-purple-800 text-white placeholder-purple-300/10' : 'bg-purple-50/30 border-purple-100'}`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Bell size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Date</label>
                  </div>
                  <input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className={`w-full border rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all ${isDarkMode ? 'bg-purple-900/20 border-purple-800 text-white' : 'bg-purple-50/30 border-purple-100'}`}
                  />
                </div>
                <div className="space-y-4 sm:col-span-2">
                  <div className="flex items-center gap-2 text-purple-500">
                    <Settings size={16} />
                    <label className="text-[10px] font-black uppercase tracking-widest">Method</label>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {["UPI", "Card", "Cash"].map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, method: m }))}
                        className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${form.method === m
                          ? 'bg-linear-to-r from-purple-600 to-indigo-600 border-transparent text-white shadow-xl shadow-purple-600/30'
                          : (isDarkMode ? 'bg-purple-900/20 border-purple-800 text-purple-300' : 'bg-white border-purple-100 text-zinc-400 hover:border-purple-300')}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-purple-400 hover:text-white' : 'text-zinc-400 hover:text-purple-600'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-2xl shadow-2xl shadow-purple-600/30 transition-all active:scale-95"
                >
                  Create Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactioncard;