"use client";

import { motion } from "framer-motion";
import { Activity, BarChart2, PieChart, TrendingUp, Search } from "lucide-react";

interface AnalyticsVisualizerProps {
    score?: number;
    tasksCompleted?: number;
}

export default function AnalyticsVisualizer({ score = 0, tasksCompleted = 0 }: AnalyticsVisualizerProps) {
    // Calculate rating based on score (similar to dashboard efficiency but letter grade)
    const getRating = (score: number) => {
        if (score >= 2000) return "S+";
        if (score >= 1000) return "A";
        if (score >= 500) return "B";
        if (score >= 200) return "C";
        return "D";
    };

    const rating = getRating(score);
    const efficiency = Math.min((score / 2000) * 100, 100);

    return (
        <div className="relative w-full h-64 md:h-72 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8 shrink-0">
            {/* Background Complex Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
                    transformOrigin: 'top center'
                }}
            />

            {/* Moving Data Blocks */}
            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-blue-500/20 backdrop-blur-sm border border-blue-500/30"
                        style={{
                            width: Math.random() * 60 + 20,
                            height: Math.random() * 40 + 20,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 0.5, 0],
                            scale: [0.8, 1, 0.8]
                        }}
                        transition={{
                            duration: 5 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Central Holographic Projection */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-32 h-32 transform-style-3d perspective-1000">
                    {/* Spinning Rings */}
                    <motion.div
                        className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
                        style={{ rotateX: 70 }}
                        animate={{ rotateZ: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-4 border border-blue-400/20 rounded-full"
                        style={{ rotateX: 70 }}
                        animate={{ rotateZ: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-8 border border-cyan-400/20 rounded-full"
                        style={{ rotateY: 70 }}
                        animate={{ rotateZ: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Center Core */}
                    <motion.div
                        className="absolute inset-[30%] bg-blue-500/10 border border-blue-500/50 backdrop-blur-md rounded-lg flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        animate={{
                            rotateY: [0, 360],
                            boxShadow: ['0 0 30px rgba(59,130,246,0.2)', '0 0 50px rgba(59,130,246,0.4)', '0 0 30px rgba(59,130,246,0.2)']
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                        <BarChart2 className="w-8 h-8 text-blue-400" />
                    </motion.div>
                </div>

                {/* Scanning Beam */}
                <motion.div
                    className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent blur-sm"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                            <div className="relative w-16 h-16 bg-[#0A0A0A] border border-blue-500/30 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/[0.05]" />
                                <TrendingUp className="w-8 h-8 text-blue-400 relative z-10" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                DATA <span className="text-blue-500 font-light">NEXUS</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-blue-400">
                                    <Activity className="w-3 h-3" />
                                    Metrics: {tasksCompleted} Tasks
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Search className="w-3 h-3 text-zinc-400" />
                                    Analysis: {efficiency.toFixed(0)}%
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Widget: Floating Stats (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-end bg-blue-500/5 border border-blue-500/10 px-4 py-2 rounded-xl backdrop-blur-sm"
                        >
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-mono font-bold text-white leading-none">{rating}</span>
                                <span className="text-[10px] text-blue-400 font-mono uppercase">Rating</span>
                            </div>
                            <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${efficiency}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
