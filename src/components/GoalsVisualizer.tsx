"use client";

import { motion } from "framer-motion";
import { Target, Crosshair, Map, Compass } from "lucide-react";

export default function GoalsVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Radar Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle at center, transparent 0%, #111 100%), repeating-linear-gradient(0deg, transparent, transparent 49px, #333 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, #333 50px)`,
                    backgroundSize: '100% 100%, 50px 50px, 50px 50px',
                }}
            />

            {/* Rotating Radar Sweep */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-[600px] h-[600px] bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-full"
                    style={{ maskImage: 'conic-gradient(from 0deg, transparent, black)' }}
                />
            </div>

            {/* HUD Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="w-64 h-64 border border-primary/20 rounded-full border-dashed"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-48 h-48 border border-white/10 rounded-full"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="absolute w-80 h-[1px] bg-white/10" />
                <div className="absolute h-80 w-[1px] bg-white/10" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full group-hover:bg-primary/30 transition-all" />
                            <div className="relative p-4 rounded-2xl bg-[#0A0A0A] border border-primary/30 shadow-[0_0_15px_-5px_rgba(251,191,36,0.3)] flex items-center justify-center backdrop-blur-xl">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            {/* Corner Brackets */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-primary/50" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-primary/50" />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                    WEEKLY <span className="text-primary font-light">GOALS</span>
                                </h1>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                <span className="flex items-center gap-1">
                                    <Crosshair className="w-3 h-3" />
                                    Target Lock
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Compass className="w-3 h-3" />
                                    Navigation Active
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating Stats / Widgets */}
                    <div className="hidden md:flex flex-col gap-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm"
                        >
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-zinc-500 font-mono">CURRENT WEEK</span>
                                <span className="text-sm font-bold text-white">Week 52</span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg backdrop-blur-sm"
                        >
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs font-bold text-primary tracking-wide">OBJECTIVES SET</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
