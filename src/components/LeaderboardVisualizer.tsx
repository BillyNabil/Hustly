"use client";

import { motion } from "framer-motion";
import { Globe, Trophy, Users, BarChart3 } from "lucide-react";

export default function LeaderboardVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Dots Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Spinning Wireframe Globe */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <motion.div
                    className="w-96 h-96 border border-white/5 rounded-full relative"
                    style={{
                        rotateX: '70deg',
                        rotateY: '0deg',
                        perspective: 1000
                    }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    {/* Latitudes */}
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.8]" />
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.6]" />
                    <div className="absolute inset-0 border border-white/5 rounded-full scale-[0.4]" />

                    {/* Orbiting Satellites */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/50 rounded-full blur-[2px] shadow-[0_0_10px_#10B981]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500/50 rounded-full blur-[2px]" />
                </motion.div>
            </div>

            {/* Vertical Data Bars */}
            <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-center gap-1 opacity-20 pointer-events-none mask-image-b-t">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-2 bg-gradient-to-t from-primary to-transparent rounded-t-sm"
                        animate={{ height: [Math.random() * 40 + 10, Math.random() * 80 + 20, Math.random() * 40 + 10] }}
                        transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Central Trophy Hologram */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-20 h-20 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-xl backdrop-blur-md flex items-center justify-center transform rotate-45">
                        <div className="transform -rotate-45">
                            <Trophy className="w-10 h-10 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 opacity-20 blur focus-within:opacity-100 transition-opacity duration-500 rounded-lg" />
                            <div className="relative w-14 h-14 bg-[#0A0A0A] border border-white/10 rounded-lg flex items-center justify-center">
                                <Globe className="w-7 h-7 text-primary" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-light">ELITE</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-blue-400">
                                    <Users className="w-3 h-3" />
                                    Players: 1,240
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <BarChart3 className="w-3 h-3 text-zinc-400" />
                                    Season: 1
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Live Ticker (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full"
                        >
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-white font-mono uppercase font-bold">Live Ranking</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
