"use client";

import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp, Target } from "lucide-react";

export default function HabitVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)`,
                    backgroundSize: '24px 24px',
                    maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                }}
            />

            {/* Animated Waveforms */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0" />
                        <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Wave 1: Consistency */}
                <motion.path
                    d="M -100 100 Q 100 50 300 100 T 700 100 T 1100 100 T 1500 100"
                    fill="none"
                    stroke="url(#wave-gradient)"
                    strokeWidth="3"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        d: [
                            "M -100 120 Q 200 60 500 120 T 1000 120 T 1500 120",
                            "M -100 120 Q 200 180 500 120 T 1000 120 T 1500 120",
                            "M -100 120 Q 200 60 500 120 T 1000 120 T 1500 120"
                        ],
                        pathLength: 1,
                        opacity: 0.6
                    }}
                    transition={{
                        d: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                        pathLength: { duration: 2, ease: "easeOut" }
                    }}
                />

                {/* Wave 2: Intensity */}
                <motion.path
                    d="M -100 120 Q 100 180 300 120 T 700 120 T 1100 120"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    animate={{
                        d: [
                            "M -100 120 Q 200 180 500 120 T 1000 120",
                            "M -100 120 Q 200 60 500 120 T 1000 120",
                            "M -100 120 Q 200 180 500 120 T 1000 120"
                        ]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.circle
                        key={i}
                        r="2"
                        fill="#FBBF24"
                        initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%", opacity: 0 }}
                        animate={{
                            y: [null, Math.random() * -50],
                            opacity: [0, 0.8, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 4,
                            repeat: Infinity,
                            delay: Math.random() * 2
                        }}
                    />
                ))}
            </svg>

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-4"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-500/20 border border-primary/20 flex items-center justify-center">
                                <Flame className="w-8 h-8 text-primary fill-primary/20" />
                            </div>
                            {/* Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border border-black flex items-center justify-center"
                            >
                                <TrendingUp className="w-2.5 h-2.5 text-black" />
                            </motion.div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                    HABIT <span className="text-zinc-600 font-light">TRACKER</span>
                                </h1>
                            </div>
                            <p className="text-zinc-400 font-mono text-xs md:text-sm max-w-md">
                        // BUILD_MOMENTUM
                                <span className="mx-2 text-zinc-600">|</span>
                                ESTABLISH_ROUTINE
                            </p>
                        </div>
                    </motion.div>

                    {/* Right Side Stats (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-2">
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-3">
                            <Trophy className="w-4 h-4 text-primary" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-zinc-500 font-mono uppercase">Top Streak</span>
                                <span className="text-lg font-bold text-white leading-none">12 DAYS</span>
                            </div>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm flex items-center gap-3">
                            <Target className="w-4 h-4 text-zinc-400" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-zinc-500 font-mono uppercase">Completion</span>
                                <span className="text-lg font-bold text-zinc-300 leading-none">85%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
