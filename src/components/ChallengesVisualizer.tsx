"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Crosshair, Timer, AlertCircle } from "lucide-react";

// Helper to format time remaining
function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();

    if (diff < 0) return { h: 0, m: 0, s: 0 };

    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return { h, m, s };
}

export default function ChallengesVisualizer() {
    const [timeLeft, setTimeLeft] = React.useState(getTimeUntilMidnight());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeUntilMidnight());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formattedTime = `${timeLeft.h.toString().padStart(2, '0')}:${timeLeft.m.toString().padStart(2, '0')}:${timeLeft.s.toString().padStart(2, '0')}`;

    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Hazard Stripes */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `repeating-linear-gradient(45deg, #000, #000 10px, #F59E0B 10px, #F59E0B 20px)`
                }}
            />

            {/* Radar Scan Effect */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <motion.div
                    className="absolute w-[600px] h-6 bg-amber-500/10 blur-xl"
                    animate={{
                        top: ['-10%', '110%'],
                        rotate: [0, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Rotating Lock Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="w-48 h-48 border-2 border-dashed border-amber-500/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-36 h-36 border border-amber-500/30 rounded-full border-t-transparent border-l-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Floating Target Markers */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute"
                    style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.5,
                        repeatDelay: Math.random() * 2
                    }}
                >
                    <Crosshair className="w-4 h-4 text-amber-500/50" />
                </motion.div>
            ))}

            {/* Central Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            {/* Pulse Effect */}
                            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />

                            <div className="relative w-16 h-16 bg-[#0A0A0A] border border-amber-500/30 rounded-xl flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-amber-500/5" />
                                {/* Lightning Icon with Glitch Effect simulated by opacity/scale */}
                                <motion.div
                                    animate={{ opacity: [1, 0.5, 1, 0.8, 1] }}
                                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Zap className="w-8 h-8 text-amber-500" />
                                </motion.div>
                            </div>
                            {/* Corner Markers */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-500" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-500" />
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                DAILY <span className="text-amber-500 font-light">OP</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-amber-500">
                                    <AlertCircle className="w-3 h-3" />
                                    Priority: High
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Timer className="w-3 h-3 text-zinc-400" />
                                    Cycle: 24H
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Countdown Widget (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-end"
                        >
                            <span className="text-[10px] text-zinc-500 font-mono uppercase">Mission Expires In</span>
                            <span className="text-2xl font-mono font-bold text-white tracking-widest tabular-nums">{formattedTime}</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
