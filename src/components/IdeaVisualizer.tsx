"use client";

import { motion } from "framer-motion";
import { Lightbulb, Sparkles, BrainCircuit, Share2, Zap } from "lucide-react";

export default function IdeaVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group">
            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #333 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-primary/20 blur-[100px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 2 }}
                    className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen"
                />
            </div>

            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <defs>
                    <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#FBbf24" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>

                {/* Horizontal Data Lines */}
                {[20, 45, 70, 85].map((y, i) => (
                    <motion.line
                        key={`h-${i}`}
                        x1="-10%"
                        y1={`${y}%`}
                        x2="110%"
                        y2={`${y}%`}
                        stroke="url(#grid-gradient)"
                        strokeWidth="1"
                        initial={{ strokeDasharray: "10 20", x: 0 }}
                        animate={{ x: ["0%", "-5%"] }}
                        transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                        className="opacity-20"
                    />
                ))}

                {/* Floating Nodes */}
                {[...Array(6)].map((_, i) => (
                    <motion.g
                        key={`node-${i}`}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%"
                        }}
                        animate={{
                            y: ["-10%", "10%"],
                            opacity: [0.2, 0.6, 0.2]
                        }}
                        transition={{
                            y: { duration: 5 + Math.random() * 5, repeat: Infinity, repeatType: "mirror" },
                            opacity: { duration: 3 + Math.random() * 2, repeat: Infinity }
                        }}
                    >
                        <circle r="2" fill="#FBbf24" />
                        <circle r="8" fill="#FBbf24" fillOpacity="0.1" />
                    </motion.g>
                ))}
            </svg>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex items-start gap-4"
                >
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl shadow-black/20">
                        <BrainCircuit className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                Idea<span className="text-primary font-light">Forge</span>
                            </h1>
                            <div className="hidden md:flex px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-mono text-primary uppercase tracking-widest">
                                v2.0 System Active
                            </div>
                        </div>
                        <p className="text-zinc-400 max-w-lg text-sm md:text-base leading-relaxed">
                            Transform abstract thoughts into concrete execution.
                            Structure your chaos into a symphony of productivity.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Shine Effect on Hover */}
            <div
                className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out] bg-gradient-to-r from-transparent via-white/5 to-transparent z-20 pointer-events-none"
            />
        </div>
    );
}
