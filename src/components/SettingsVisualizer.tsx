"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Cpu, RefreshCw, Sliders } from "lucide-react";

import { Profile } from "@/lib/database.types";

interface SettingsVisualizerProps {
    profile: Profile | null;
}

export default function SettingsVisualizer({ profile }: SettingsVisualizerProps) {
    const focusLevel = Math.min(((profile?.total_focus_hours || 0) / 100), 1) * 100;
    const hustleLoad = Math.min(((profile?.productivity_score || 0) / 2000), 1) * 100;

    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8 shrink-0">
            {/* Background Circuitry */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Animated Circuit Paths */}
            <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full opacity-30">
                    <motion.path
                        d="M 100 0 V 100 H 300 V 200"
                        fill="none"
                        stroke="url(#gradient-path)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path
                        d="M 800 200 V 100 H 600 V 0"
                        fill="none"
                        stroke="url(#gradient-path)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                    />
                    <defs>
                        <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="#A855F7" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Central Rotating Gear/Core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-40 h-40">
                    {/* Outer Gear */}
                    <motion.div
                        className="absolute inset-0 border-2 border-dashed border-purple-500/20 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute inset-2 border border-purple-500/10 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Mechanism */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-xl backdrop-blur-sm flex items-center justify-center rotate-45"
                            animate={{ rotate: [45, 225, 45] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="w-8 h-8 flex items-center justify-center -rotate-45"
                                animate={{ rotate: [-45, -225, -45] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Settings className="w-6 h-6 text-purple-400" />
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Orbiting Elements */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7]" />
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
                <div className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-5"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
                            <div className="relative w-14 h-14 bg-[#0A0A0A] border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg">
                                <Cpu className="w-7 h-7 text-purple-400" />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
                                SYSTEM <span className="text-purple-500 font-light">CONFIG</span>
                            </h1>
                            <div className="flex items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-purple-400">
                                    <Shield className="w-3 h-3" />
                                    Identity: {profile?.display_name || "Unknown"}
                                </span>
                                <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                                <span className="flex items-center gap-1">
                                    <RefreshCw className="w-3 h-3 text-zinc-400" />
                                    Sync: Auto
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Widget: Status Indicators (Desktop) */}
                    <div className="hidden md:flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono uppercase">Focus</span>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        className={`w-1.5 h-3 rounded-sm ${i < (focusLevel / 25) ? 'bg-purple-500' : 'bg-purple-500/20'}`}
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-500 font-mono uppercase">Load</span>
                            <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${hustleLoad}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
