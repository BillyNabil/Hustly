"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, Activity, Zap } from "lucide-react";

export default function ScheduleVisualizer() {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) return null;

    // Calculate day progress
    const startOfDay = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 0, 0, 0);
    const endOfDay = new Date(time.getFullYear(), time.getMonth(), time.getDate(), 23, 59, 59);
    const progress = ((time.getTime() - startOfDay.getTime()) / (endOfDay.getTime() - startOfDay.getTime())) * 100;

    // Format parts
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const ap = time.getHours() >= 12 ? 'PM' : 'AM';

    return (
        <div className="relative w-full h-48 md:h-56 rounded-3xl overflow-hidden border border-white/5 bg-[#050505] group mb-8">
            {/* Background Tech Mesh */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* Animated Pulse Line */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2">
                <motion.div
                    className="absolute top-0 h-full bg-primary/50 box-shadow-[0_0_20px_#FBBF24]"
                    style={{ width: '10%' }}
                    animate={{ left: ['-10%', '110%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Main Content Container */}
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 relative z-10">

                {/* Left: Digital Clock */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-baseline gap-2">
                        <div className="text-6xl md:text-7xl font-mono font-bold text-white tracking-tighter tabular-nums">
                            {hours}:{minutes}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-mono text-zinc-500 font-medium">{seconds}</span>
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">{ap}</span>
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>

                {/* Middle: Progress Bar Visualization */}
                <div className="flex-1 max-w-sm w-full mx-8 hidden md:block">
                    <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2">
                        <span>00:00</span>
                        <span>DAY PROGRESS</span>
                        <span>23:59</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", damping: 20 }}
                        />
                        {[25, 50, 75].map(p => (
                            <div key={p} className="absolute top-0 bottom-0 w-px bg-black/50 z-10" style={{ left: `${p}%` }} />
                        ))}
                    </div>
                    <div className="flex justify-end mt-1">
                        <span className="text-xs font-mono text-primary">{progress.toFixed(1)}%</span>
                    </div>
                </div>

                {/* Right: Status */}
                <div className="hidden md:flex flex-col items-end gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-zinc-500 font-mono uppercase">System Status</span>
                            <span className="text-sm text-green-500 font-bold flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                ONLINE
                            </span>
                        </div>
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                            <Activity className="w-5 h-5 text-green-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-zinc-500 font-mono uppercase">Focus Mode</span>
                            <span className="text-sm text-white font-bold">READY</span>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
