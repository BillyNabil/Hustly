"use client";

import { useState, useMemo, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  CreditCard,
  X,
  Trash2,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction, TransactionType } from "@/lib/database.types";
import { transitions, fadeUp, staggerContainer, scaleIn, modalOverlay, modalContent } from "@/lib/animations";
import { getTransactions, createTransaction, deleteTransaction } from "@/lib/supabase-service";

const incomeCategories = ["Freelance", "Side Hustle", "Client Work", "Passive Income", "Investment", "Other"];
const expenseCategories = ["Software", "Marketing", "Equipment", "Education", "Services", "Food", "Transport", "Other"];

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Partial<Transaction>) => void;
  type: TransactionType;
}

function TransactionModal({ isOpen, onClose, onAdd, type }: TransactionModalProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const categories = type === "income" ? incomeCategories : expenseCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      description: description || null,
      source: source || null,
      date,
    });

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setSource("");
    setDate(new Date().toISOString().split("T")[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalOverlay}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalContent}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-card border border-primary/20 rounded-2xl p-6 w-full max-w-md shadow-2xl gpu-accelerate"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              type === "income"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            )}>
              {type === "income" ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
            <h3 className="text-lg font-bold text-white">
              Add {type === "income" ? "Income" : "Expense"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Amount ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-bold"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="What was this for?"
            />
          </div>

          {type === "income" && (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Source</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Where did this come from?"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-secondary/50 border border-primary/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-primary/20 text-muted-foreground hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={cn(
                "flex-1 py-2.5 rounded-lg font-bold transition-colors",
                type === "income"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-400 hover:to-green-500"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500"
              )}
            >
              Add {type === "income" ? "Income" : "Expense"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function FinanceTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState<TransactionType | null>(null);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  // Fetch transactions from Supabase
  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      const data = await getTransactions();
      setTransactions(data);
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (filter === "all") return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const handleAddTransaction = async (data: Partial<Transaction>) => {
    const created = await createTransaction(data);
    if (created) {
      setTransactions(prev => [created, ...prev]);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const success = await deleteTransaction(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-yellow-500">
            Finance Tracker
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1 hidden sm:block">
            Track your side hustle income and expenses
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen("expense")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-colors text-sm"
          >
            <TrendingDown className="w-4 h-4" />
            Expense
          </button>
          <button
            onClick={() => setModalOpen("income")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-400 hover:to-green-500 transition-colors shadow-lg shadow-green-500/20 text-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Income
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-3 gap-2 md:gap-4 mb-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="glass-panel p-3 md:p-5 rounded-xl border border-green-500/20 card-hover gpu-accelerate"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
            </div>
            <span className="text-[10px] md:text-sm text-muted-foreground font-medium">Total Income</span>
          </div>
          <p className="text-lg md:text-3xl font-bold text-green-400">${summary.income.toLocaleString()}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass-panel p-3 md:p-5 rounded-xl border border-red-500/20 card-hover gpu-accelerate"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
            </div>
            <span className="text-[10px] md:text-sm text-muted-foreground font-medium">Total Expenses</span>
          </div>
          <p className="text-lg md:text-3xl font-bold text-red-400">${summary.expenses.toLocaleString()}</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="glass-panel p-3 md:p-5 rounded-xl border border-primary/20 card-hover gpu-accelerate"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <PiggyBank className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            </div>
            <span className="text-[10px] md:text-sm text-muted-foreground font-medium">Net Balance</span>
          </div>
          <p className={cn(
            "text-lg md:text-3xl font-bold",
            summary.balance >= 0 ? "text-primary" : "text-red-400"
          )}>
            {summary.balance >= 0 ? "+" : "-"}${Math.abs(summary.balance).toLocaleString()}
          </p>
        </motion.div>
      </motion.div>

      {/* Transactions List */}
      <div className="flex-1 bg-card/50 rounded-2xl border border-primary/10 overflow-hidden flex flex-col">
        {/* Filter Header */}
        <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between">
          <h3 className="font-semibold text-white">Recent Transactions</h3>
          <div className="flex gap-2">
            {(["all", "income", "expense"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                  filter === f
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-white/5"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {filteredTransactions.map(transaction => (
              <motion.div
                key={transaction.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-white/5 hover:border-primary/20 transition-colors group"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  transaction.type === "income"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                )}>
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm truncate">
                      {transaction.description || transaction.category}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {transaction.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {transaction.source && (
                      <span className="text-xs text-muted-foreground">{transaction.source}</span>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className={cn(
                    "font-bold text-lg",
                    transaction.type === "income" ? "text-green-400" : "text-red-400"
                  )}>
                    {transaction.type === "income" ? "+" : "-"}${Number(transaction.amount).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CreditCard className="w-12 h-12 mb-3 opacity-50" />
              <p>No transactions yet</p>
              <p className="text-sm">Start tracking your hustle money!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <TransactionModal
            isOpen={!!modalOpen}
            onClose={() => setModalOpen(null)}
            onAdd={handleAddTransaction}
            type={modalOpen}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
