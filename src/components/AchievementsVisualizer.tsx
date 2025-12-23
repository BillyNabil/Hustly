"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Crown, Medal } from "lucide-react";

export default function AchievementsVisualizer() {
    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Radial Void */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `radial-gradient(circle at center, #222 0%, #050505 70%)`
                }}
            />

            {/* Animated Light Pillars (God Rays) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-20 h-[150%] bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent blur-xl"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: '-20%',
                            transformOrigin: 'top center',
                            transform: `rotate(${(i - 2) * 20}deg)`
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scaleY: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Central Rotating Trophy/Monolith */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Orbit Rings */}
                <motion.div
                    className="absolute w-40 h-40 border border-yellow-500/20 rounded-full"
                    style={{ rotateX: '60deg' }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-56 h-56 border border-white/5 rounded-full"
                    style={{ rotateX: '60deg', rotateY: '10deg' }}
                    animate={{ rotateZ: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Hologram Effect Base */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 w-32 h-8 bg-yellow-500/20 blur-xl rounded-[100%]" />
            </div>

            {/* Floating Particles (Sparkles) */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_5px_#FBBF24]"
                    style={{
                        left: `${Math.random() * 60 + 20}%`,
                        top: `${Math.random() * 60 + 20}%`
                    }}
                    animate={{
                        y: [0, -30],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3
                    }}
                />
            ))}

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group perspective-[1000px]">
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 bg-gradient-to-br from-[#1a1a1a] to-black border border-yellow-500/30 flex items-center justify-center relative rounded-md shadow-[0_0_20px_-5px_rgba(251,191,36,0.3)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <Trophy className="w-8 h-8 text-yellow-500" />
                            </motion.div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                HALL OF <span className="text-yellow-500 font-light">FAME</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1">
                                    <Crown className="w-3 h-3 text-yellow-600" />
                                    Elite Status
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <Medal className="w-3 h-3 text-zinc-400" />
                                    Records: All Time
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Widget (Desktop) */}
                    <div className="hidden md:flex flex-col items-end gap-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 px-4 py-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg backdrop-blur-sm"
                        >
                            <Award className="w-4 h-4 text-yellow-500" />
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-zinc-500 font-mono">UNLOCK RATIO</span>
                                <span className="text-sm font-bold text-yellow-500">TOP 1%</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
