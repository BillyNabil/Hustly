"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface FinanceVisualizerProps {
    monthlyIncome?: number;
    monthlyExpense?: number;
}

export default function FinanceVisualizer({ monthlyIncome = 0, monthlyExpense = 0 }: FinanceVisualizerProps) {
    const netFlow = monthlyIncome - monthlyExpense;
    const netFlowPercentage = monthlyExpense > 0
        ? ((monthlyIncome - monthlyExpense) / monthlyExpense) * 100
        : monthlyIncome > 0 ? 100 : 0;

    // Determine flow intensity based on transaction volume (simplified)
    const incomeIntensity = Math.min(monthlyIncome / 1000, 1);
    const expenseIntensity = Math.min(monthlyExpense / 1000, 1);

    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Data Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 90%)'
                }}
            />

            {/* Animated Stream Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
                        <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="expense-gradient" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0" />
                        <stop offset="50%" stopColor="#EF4444" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Income Stream */}
                <motion.path
                    d="M -100 80 C 100 80, 200 40, 400 110 S 700 80, 1000 110"
                    fill="none"
                    stroke="url(#flow-gradient)"
                    strokeWidth={2 + incomeIntensity * 3}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: [0, 100, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Expense/Outflow Stream (Subtle) */}
                <motion.path
                    d="M 1200 140 C 900 140, 800 180, 600 120 S 300 140, 0 120"
                    fill="none"
                    stroke="url(#expense-gradient)"
                    strokeWidth={1 + expenseIntensity * 2}
                    strokeOpacity="0.5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: [0, 1, 0],
                        opacity: [0, 0.5, 0],
                        x: [0, -100, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
                />
            </svg>

            {/* Floating Particles (Coins) */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-400 rounded-full"
                    style={{
                        left: `${Math.random() * 40 + 30}%`,
                        top: `${Math.random() * 60 + 20}%`
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut"
                    }}
                />
            ))}

            {/* Central Hub */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            {/* Hexagon Shape CSS */}
                            <div className="w-16 h-16 bg-[#0A0A0A] border border-green-500/30 flex items-center justify-center relative clip-path-hexagon backdrop-blur-xl shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
                                <div className="absolute inset-0 bg-green-500/10 clip-path-hexagon animate-pulse" />
                                <Wallet className="w-8 h-8 text-green-500" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                FINANCE <span className="text-green-500/50 font-light">CORE</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                                    In: ${monthlyIncome.toLocaleString()}
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <ArrowDownRight className="w-3 h-3 text-red-500" />
                                    Out: ${monthlyExpense.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Ticker (Desktop) */}
                    <div className="hidden md:flex flex-col gap-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm"
                        >
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-green-500/70 font-mono uppercase">Net Flow</span>
                                <span className={`text-sm font-bold ${netFlow >= 0 ? "text-green-400" : "text-red-400"}`}>
                                    {netFlow >= 0 ? "+" : ""}{netFlowPercentage.toFixed(1)}%
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
