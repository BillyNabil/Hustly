"use client";

import { motion } from "framer-motion";
import { Eye, Rocket, Compass, Sparkles } from "lucide-react";

export default function VisionVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Horizon Grid */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-[#050505] opacity-50" />

            {/* Perspective Grid */}
            <div className="absolute inset-0 flex items-center justify-center perspective-[500px] overflow-hidden">
                <motion.div
                    className="absolute bottom-0 w-[200%] h-full bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[length:100%_40px]"
                    style={{
                        transform: 'rotateX(60deg) translateY(50%)',
                        transformOrigin: 'bottom'
                    }}
                    animate={{
                        backgroundPosition: ['0px 0px', '0px 40px']
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Vertical Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(245,158,11,0.1)_1px,transparent_1px)] bg-[length:60px_100%]" />
                </motion.div>
            </div>

            {/* Sun / Portal */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 overflow-hidden">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-64 rounded-full bg-gradient-to-t from-orange-500/20 via-primary/10 to-transparent blur-[20px]"
                />
            </div>

            {/* Floating Elements (Milestones) */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg"
                    style={{
                        width: Math.random() * 40 + 20,
                        height: Math.random() * 60 + 30,
                        left: `${(i + 1) * 15 + Math.random() * 10}%`,
                    }}
                    initial={{ bottom: -100, scale: 0.5, opacity: 0 }}
                    animate={{
                        bottom: "60%",
                        scale: 0.2,
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Shooting Stars */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`star-${i}`}
                    className="absolute h-[1px] w-20 bg-gradient-to-r from-transparent via-white to-transparent"
                    style={{
                        top: `${Math.random() * 40}%`,
                        left: `${Math.random() * 50}%`,
                        rotate: '-45deg'
                    }}
                    animate={{
                        x: [0, 200],
                        y: [0, 200],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: Math.random() * 5 + 4,
                        ease: "easeIn"
                    }}
                />
            ))}


            {/* Central Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-start justify-between">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full group-hover:bg-orange-500/30 transition-all" />
                            <div className="relative p-4 rounded-full bg-[#0A0A0A] border border-orange-500/30 flex items-center justify-center">
                                <Eye className="w-8 h-8 text-orange-500" />
                            </div>
                            {/* Orbiting Dot */}
                            <motion.div
                                className="absolute inset-0 border border-orange-500/20 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_#F97316]" />
                            </motion.div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                VISION <span className="text-orange-500 font-light">BOARD</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <Compass className="w-3 h-3 text-orange-400" />
                                    Trajectory: Locked
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Rocket className="w-3 h-3 text-zinc-400" />
                                    Manifesting
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quote / Widget (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-2 text-right">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-[200px]"
                        >
                            <p className="text-xs text-zinc-400 font-mono italic">
                                "The best way to predict the future is to create it."
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center gap-2"
                        >
                            <Sparkles className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] font-bold text-orange-500 uppercase">Dream Mode Active</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
