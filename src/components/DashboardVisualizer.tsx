"use client";

import { motion } from "framer-motion";
import {
    Activity,
    Globe,
    Target,
    Zap,
    Cpu,
    BarChart3,
    ShieldCheck,
    Wifi
} from "lucide-react";

import { DashboardStats } from "@/lib/supabase-service";

interface DashboardVisualizerProps {
    stats: DashboardStats | null;
}

export default function DashboardVisualizer({ stats }: DashboardVisualizerProps) {
    const score = stats?.productivityScore || 0;
    const level = stats?.hustleLevel || "OFFLINE";
    const income = stats?.monthlyIncome || 0;

    // Calculate system efficiency percentage based on max score of 2000 (Empire Builder)
    const efficiency = Math.min(Math.round((score / 2000) * 100), 100);

    return (
        <div className="relative w-full h-56 md:h-64 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8 shrink-0">
            {/* Background Grid & Scanlines */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(245, 166, 35, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 166, 35, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 90%)'
                }}
            />

            {/* Radial Radar Scan */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-[500px] h-[500px]">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F5A623]/10 to-transparent"
                        style={{ rotate: 0, willChange: "transform" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-b from-transparent to-[#F5A623]/50 shadow-[0_0_15px_#F5A623]" />
                    </motion.div>
                </div>
            </div>

            {/* Floating Holographic Elements */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Left - System Status */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute top-6 left-6 flex items-center gap-2"
                    style={{ willChange: "opacity, transform" }}
                >
                    <Activity className="w-4 h-4 text-[#F5A623]" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#F5A623] font-mono tracking-widest uppercase">System Status</span>
                        <span className="text-xs text-white font-bold tracking-wider">{efficiency}% EFFICIENCY</span>
                    </div>
                </motion.div>

                {/* Top Right - Network */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="absolute top-6 right-6 flex items-center gap-2 text-right"
                    style={{ willChange: "opacity, transform" }}
                >
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-[#F5A623] font-mono tracking-widest uppercase">Connection</span>
                        <span className="text-xs text-white font-bold tracking-wider uppercase">{level}</span>
                    </div>
                    <Wifi className="w-4 h-4 text-[#F5A623]" />
                </motion.div>

                {/* Bottom Left - CPU Load */}
                <div className="absolute bottom-6 left-6 pointer-events-none">
                    <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] text-zinc-500 font-mono">CORE PROCESSING</span>
                    </div>
                    <div className="flex gap-0.5">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`w-1.5 h-3 ${i < (efficiency / 100) * 12 ? 'bg-[#F5A623]' : 'bg-zinc-800'}`}
                                initial={{ opacity: 0.2 }}
                                animate={{ opacity: [0.2, 0.8, 0.2] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    repeatType: "reverse"
                                }}
                                style={{ willChange: "opacity" }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Central Command Hub */}
            <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
                <div className="relative">
                    {/* Core Glow */}
                    <div className="absolute inset-0 bg-[#F5A623]/20 blur-3xl rounded-full" />

                    {/* Center Circle */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#F5A623]/30 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                        style={{ willChange: "transform, opacity, scale" }}
                    >
                        {/* Inner Rotating Ring */}
                        <motion.div
                            className="absolute inset-3 border-r-2 border-[#F5A623] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            style={{ willChange: "transform" }}
                        />

                        {/* Core Icon */}
                        <div className="flex flex-col items-center gap-1 z-10">
                            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#F5A623]" />
                            <span className="text-[10px] font-mono text-[#F5A623]/80 uppercase tracking-widest">HQ v1.0</span>
                        </div>
                    </motion.div>

                    {/* Orbiting Modules */}
                    <div className="absolute inset-0 animate-pulse">
                        {/* Module 1: Finance */}
                        <motion.div
                            className="absolute top-0 right-0 -translate-y-4 translate-x-12 hidden md:flex items-center gap-2 bg-[#0A0A0A] border border-white/10 px-3 py-1.5 rounded-full"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0, y: [0, -5, 0] }}
                            transition={{ delay: 0.8, duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            style={{ willChange: "transform, opacity" }}
                        >
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-zinc-300 font-mono">${income.toLocaleString()}</span>
                        </motion.div>

                        {/* Module 2: Analytics */}
                        <motion.div
                            className="absolute bottom-0 left-0 translate-y-4 -translate-x-12 hidden md:flex items-center gap-2 bg-[#0A0A0A] border border-white/10 px-3 py-1.5 rounded-full"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, y: [0, 5, 0] }}
                            transition={{ delay: 1.0, duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            style={{ willChange: "transform, opacity" }}
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs text-zinc-300 font-mono">SCORE: {score}</span>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        COMMAND <span className="text-[#F5A623] font-light">CENTER</span>
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-500 font-mono mt-1 uppercase tracking-widest">
                        {level} • Real-time Data
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
