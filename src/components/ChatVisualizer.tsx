"use client";

import { motion } from "framer-motion";
import { Bot, Cpu, Network, Activity } from "lucide-react";

export default function ChatVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-4 shrink-0">
            {/* Background Digital Rain / Matrix Effect (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[length:20px_20px] opacity-20" />

            {/* Animated Data Streams */}
            <div className="absolute inset-0 flex justify-between px-10 opacity-10 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary to-transparent"
                        animate={{
                            backgroundPosition: ['0% -100%', '0% 200%'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 5,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Central Cortex Core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Outer Shell */}
                <motion.div
                    className="w-32 h-32 border border-primary/20 rounded-full"
                    animate={{ scale: [1, 1.05, 1], rotate: 180 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary/50 rounded-full box-shadow-[0_0_10px_#10B981]" />
                </motion.div>

                {/* Inner Gyroscope */}
                <motion.div
                    className="absolute w-24 h-24 border border-primary/30 rounded-full border-t-transparent border-b-transparent"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />

                {/* Core Pulse */}
                <motion.div
                    className="absolute w-12 h-12 bg-primary/10 rounded-full backdrop-blur-md flex items-center justify-center"
                    animate={{
                        boxShadow: ['0 0 20px rgba(16,185,129,0)', '0 0 40px rgba(16,185,129,0.3)', '0 0 20px rgba(16,185,129,0)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Bot className="w-6 h-6 text-primary" />
                </motion.div>
            </div>

            {/* Floating Network Nodes */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-zinc-800 border border-zinc-600 rounded-full"
                    style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                    }}
                    animate={{
                        scale: [1, 1.5, 1],
                        borderColor: ['#52525b', '#10B981', '#52525b']
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                    }}
                >
                    {/* Connecting Lines (Simulated) */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-20 h-[1px] bg-gradient-to-r from-primary/50 to-transparent origin-left"
                        style={{ rotate: `${Math.random() * 360}deg`, zIndex: -1 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    />
                </motion.div>
            ))}

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
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <div className="relative w-16 h-16 bg-[#0A0A0A] border border-primary/30 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Cpu className="w-8 h-8 text-primary" />
                            </div>
                            {/* Status Dot */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full animate-pulse" />
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                GHOST <span className="text-primary font-light">CEO</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-primary">
                                    <Activity className="w-3 h-3" />
                                    System: Online
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Network className="w-3 h-3 text-zinc-400" />
                                    Neural Net: Active
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Widget: Processing Speed (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-end"
                        >
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-mono font-bold text-white leading-none">98.4</span>
                                <span className="text-xs text-primary font-mono mb-1">%</span>
                            </div>
                            <span className="text-[10px] text-zinc-500 font-mono uppercase">Cognitive Load</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
