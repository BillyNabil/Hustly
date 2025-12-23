"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Zap,
    Target,
    Bot,
    Trophy,
    Wallet,
    ArrowRight,
    CheckCircle2,
    Globe,
    Activity,
    BrainCircuit,
    Shield,
    Lock,
    DollarSign,
    ChevronDown,
    Flame,
    Terminal,
    Cpu,
    Network,
    Scan,
    BarChart4,
    TrendingUp,
    Dna,
    Monitor,
    Smartphone
} from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

// --- Advanced Motion Components ---

const LoopGrid = () => (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none perspective-[500px] overflow-hidden">
        <motion.div
            className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            animate={{
                backgroundPosition: ["0px 0px", "0px 40px"]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{
                transform: "rotateX(20deg) scale(1.5)"
            }}
        />
    </div>
);

const ParticleField = () => {
    // Generate random particles
    const particles = [...Array(20)].map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5
    }));

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute bg-white/20 rounded-full blur-[1px]"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: [0, -100],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay
                    }}
                />
            ))}
        </div>
    );
};

// --- Complex Visualizers (Motion Graphics) ---

const DNAHelix = () => {
    return (
        <div className="relative w-full h-[300px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="relative w-8 h-40 flex flex-col justify-between items-center">
                        {/* Top Strand */}
                        <motion.div
                            className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            animate={{
                                y: [0, 140, 0],
                                scale: [1, 0.5, 1],
                                opacity: [1, 0.5, 1],
                                zIndex: [10, 0, 10]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2
                            }}
                        />
                        {/* Connecting Line (Holographic) */}
                        <motion.div
                            className="w-[1px] bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0"
                            animate={{
                                height: [160, 0, 160],
                                opacity: [0.2, 0, 0.2]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2
                            }}
                        />
                        {/* Bottom Strand */}
                        <motion.div
                            className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            animate={{
                                y: [0, -140, 0],
                                scale: [1, 0.5, 1],
                                opacity: [1, 0.5, 1],
                                zIndex: [0, 10, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2
                            }}
                        />
                    </div>
                ))}
            </div>
            {/* Background scanner */}
            <motion.div
                className="absolute top-0 bottom-0 w-[50px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent skew-x-12"
                animate={{ left: ["-20%", "120%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

const FinanceReactor = () => {
    return (
        <div className="relative w-full h-[300px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden">
            {/* Core */}
            <div className="relative w-48 h-48 flex items-center justify-center">

                {/* Outer Ring - Dashed - Rotates Slow */}
                <motion.div
                    className="absolute inset-0 border border-dashed border-green-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle Ring - Segments - Rotates Med */}
                <motion.div
                    className="absolute inset-4 border-2 border-transparent border-t-green-500/50 border-b-green-500/50 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring - Solid - Pulse */}
                <motion.div
                    className="absolute inset-12 border border-green-400/80 rounded-full shadow-[0_0_30px_rgba(74,222,128,0.2)]"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Central Value */}
                <div className="flex flex-col items-center z-10 text-green-400">
                    <DollarSign className="w-8 h-8 mb-1" />
                    <motion.span
                        className="font-mono font-bold text-2xl tracking-tighter"
                        animate={{ opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        $8,450
                    </motion.span>
                </div>

                {/* Orbiting Satellite */}
                <motion.div
                    className="absolute w-full h-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10px] w-3 h-3 bg-green-400 rounded-full blur-[2px]" />
                </motion.div>
            </div>

            {/* Moving Grid Background */}
            <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>
    );
};

const HoloGlobe = () => {
    return (
        <div className="relative w-full h-[300px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden perspective-[1000px]">
            <div className="relative w-64 h-64 transform-style-3d">
                {/* Globe Wireframe Rings */}
                {[0, 60, 120].map((deg, i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 border border-amber-500/30 rounded-full"
                        style={{ rotateY: deg }}
                        animate={{ rotateX: 360, rotateY: deg + 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                ))}

                {/* Horizontal Rings */}
                {[0, 45, 90, 135].map((deg, i) => (
                    <motion.div
                        key={`h-${i}`}
                        className="absolute inset-[15%] border border-amber-500/20 rounded-full"
                        style={{ rotateX: 70 }}
                        animate={{ rotateZ: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i }}
                    />
                ))}

                {/* Core & Pulse */}
                <div className="absolute inset-[40%] bg-amber-500/10 rounded-full blur-xl animate-pulse" />

                {/* Pinging Dots */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`dot-${i}`}
                        className="absolute w-2 h-2 bg-amber-400 rounded-full box-shadow-[0_0_10px_rgba(251,191,36,1)]"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                            x: [0, (Math.random() - 0.5) * 100],
                            y: [0, (Math.random() - 0.5) * 100]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
                        style={{ top: '50%', left: '50%' }}
                    />
                ))}
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-xs text-amber-500/70">
                <span className="animate-pulse">●</span> LIVE CONNECTIONS_
            </div>
        </div>
    );
};

const NeuralWeb = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Nodes */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-16 h-16 border border-purple-500/20 bg-purple-500/5 rounded-full flex items-center justify-center backdrop-blur-sm"
                    animate={{
                        x: [
                            (Math.random() - 0.5) * 200,
                            (Math.random() - 0.5) * 200,
                            (Math.random() - 0.5) * 200
                        ],
                        y: [
                            (Math.random() - 0.5) * 100,
                            (Math.random() - 0.5) * 100,
                            (Math.random() - 0.5) * 100
                        ],
                    }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatType: "mirror"
                    }}
                >
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    {/* Floating Connection Lines */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 h-[1px] bg-gradient-to-r from-purple-500/40 to-transparent origin-left"
                        style={{ width: '100px' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

// --- Helper Components ---

const SpotlightCard = ({ children, className, glowColor = "amber", title, subtitle, icon: Icon, delay = 0 }: any) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const colorMap: Record<string, string> = {
        amber: "251, 191, 36",
        blue: "59, 130, 246",
        green: "74, 222, 128",
        purple: "168, 85, 247"
    };

    const rgb = colorMap[glowColor] || colorMap.amber;

    return (
        <motion.div
            variants={fadeUp}
            custom={delay}
            className={cn(
                "relative h-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/40 backdrop-blur-sm group",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px transition duration-300 opacity-0 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          600px circle at ${mouseX}px ${mouseY}px,
                          rgba(${rgb}, 0.15),
                          transparent 80%
                        )
                      `,
                }}
            />
            {/* Scanline Effect - Subtle */}
            <motion.div
                className={cn("absolute inset-0 opacity-[0.03] z-0 pointer-events-none",
                    `bg-[length:4px_4px] bg-repeat`
                )}
                style={{ backgroundImage: `linear-gradient(to bottom, transparent 50%, rgba(${rgb}, 1) 50%)` }}
            />

            <div className="relative z-20 p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "p-3 rounded-lg border backdrop-blur-md transition-colors duration-300",
                        `bg-${glowColor}-500/10 border-${glowColor}-500/20 text-${glowColor}-500 group-hover:text-${glowColor}-400 group-hover:border-${glowColor}-500/50`
                    )}>
                        {Icon && <Icon className="w-6 h-6" />}
                    </div>
                </div>

                <div className="mt-auto relative">
                    <h3 className="font-bold text-xl text-white mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{title}</h3>
                    <p className="text-sm text-zinc-400 font-medium leading-relaxed group-hover:text-zinc-300 transition-colors">{subtitle}</p>
                </div>
            </div>

            {/* Visualizer Container */}
            <div className="absolute inset-0 z-0 opacity-100">
                {children}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-[1]" />
        </motion.div>
    );
};

const SectionHeader = ({ number, title, description, align = "left" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className={cn("mb-16", align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-2xl")}
    >
        <div className={cn("flex items-center gap-4 mb-6", align === "center" && "justify-center")}>
            <span className="text-sm font-mono text-amber-500/80 tracking-widest px-2 py-1 rounded border border-amber-500/20 bg-amber-500/5">
                {number}
            </span>
            <div className="h-[1px] w-12 bg-amber-500/30" />
            <span className="text-sm font-mono text-zinc-500 tracking-widest uppercase">{title}</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[0.9] tracking-tight">
            {description}
        </h2>
    </motion.div>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] overflow-x-hidden relative text-white font-sans selection:bg-amber-500/30 selection:text-amber-100">
            {/* Global Background */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]" />
                <LoopGrid />
                <ParticleField />
            </div>



            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
                <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    <div className="flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 self-start px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono text-zinc-300">SYSTEM V2.0 ONLINE</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">BUILD</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">YOUR</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-600 animate-gradient-x py-2 block">
                                EMPIRE
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
                            The all-in-one operating system for high-activity individuals.
                            Programmable habits, financial clarity, and AI-driven biological optimization.
                        </p>

                        <div className="flex flex-col items-start gap-6 mt-2">
                            {/* Primary CTA */}
                            <Link href="/register" className="group w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-8 py-5 bg-white text-black font-bold text-lg tracking-wide flex items-center justify-center gap-3 rounded-lg hover:bg-zinc-200 transition-colors relative overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                    <span className="relative z-10 flex items-center gap-2">
                                        GET STARTED <ArrowRight className="w-5 h-5" />
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-amber-500/20"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '0%' }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </button>
                            </Link>

                            {/* Secondary Platform Downloads */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Link href="/download/desktop" className="group flex-1">
                                    <button className="w-full h-12 px-4 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm font-medium tracking-wide flex items-center justify-center gap-2 rounded-lg hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all whitespace-nowrap">
                                        <Monitor className="w-4 h-4" /> <span>DESKTOP APP</span>
                                    </button>
                                </Link>

                                <Link href="/download/mobile" className="group flex-1">
                                    <button className="w-full h-12 px-4 bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-sm font-medium tracking-wide flex items-center justify-center gap-2 rounded-lg hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all whitespace-nowrap">
                                        <Smartphone className="w-4 h-4" /> <span>MOBILE APP</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Active Hero Visual - HUD Style */}
                    <div className="relative h-[500px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-amber-500/5 blur-[100px] rounded-full" />

                        {/* Spinning Rings */}
                        <motion.div
                            className="absolute w-[400px] h-[400px] border border-white/5 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-white/20 rounded-full" />
                        </motion.div>

                        <motion.div
                            className="absolute w-[300px] h-[300px] border border-dashed border-amber-500/20 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        />

                        {/* Center Brain */}
                        <div className="relative z-10 w-48 h-48 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden p-6">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/logo.png"
                                    alt="Hustly Logo"
                                    fill
                                    className="object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                                />
                            </div>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/10 to-transparent"
                                animate={{ top: ['-100%', '100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            className="absolute top-10 right-10 p-4 bg-black/80 backdrop-blur border border-green-500/30 rounded-lg flex items-center gap-3"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="p-2 bg-green-500/10 rounded"><TrendingUp className="w-5 h-5 text-green-500" /></div>
                            <div>
                                <p className="text-xs text-zinc-400 uppercase">Revenue</p>
                                <p className="text-sm font-mono text-green-400">+24.5%</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-20 left-0 p-4 bg-black/80 backdrop-blur border border-blue-500/30 rounded-lg flex items-center gap-3"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <div className="p-2 bg-blue-500/10 rounded"><Activity className="w-5 h-5 text-blue-500" /></div>
                            <div>
                                <p className="text-xs text-zinc-400 uppercase">Habit Streak</p>
                                <p className="text-sm font-mono text-blue-400">42 DAYS</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Feature 01: Habit Architecture */}
            <section className="py-32 px-6">
                <SectionHeader
                    number="01"
                    title="HABIT ARCHITECTURE"
                    description={<>REPROGRAM YOUR <span className="text-blue-500">BIOLOGY</span></>}
                    align="center"
                />

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
                    <div className="h-[400px]">
                        <SpotlightCard
                            title="DNA Serialization"
                            subtitle="Visualize your consistency with our genetic-inspired tracker. Every rep contributes to the sequence."
                            icon={Dna}
                            glowColor="blue"
                            className="h-full"
                        >
                            <DNAHelix />
                        </SpotlightCard>
                    </div>
                    <div className="grid gap-8">
                        <SpotlightCard
                            title="Streak Protocols"
                            subtitle="Algorithmic accountability that adapts to your failure points."
                            icon={Zap}
                            glowColor="blue"
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Zap className="w-32 h-32" />
                            </div>
                        </SpotlightCard>
                        <SpotlightCard
                            title="Dopamine Engineering"
                            subtitle="Gamified milestones designed to maximize neuroplasticity."
                            icon={Flame}
                            glowColor="purple"
                        />
                    </div>
                </div>
            </section>

            {/* Feature 02: Finance */}
            <section className="py-32 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-5">
                        <SectionHeader
                            number="02"
                            title="FINANCE REACTOR"
                            description={<>COMPOUND YOUR <span className="text-green-500">CAPITAL</span></>}
                        />
                        <p className="text-zinc-400 text-lg mb-8">
                            A centralized command center for your entire financial existence.
                            Track burn rate, project runway, and visualize multiple income streams in real-time.
                        </p>
                        <ul className="space-y-4">
                            {['Multi-Account Aggregation', 'Automatic Expense Categorization', 'Net Worth Projection'].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/80">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="lg:col-span-7 h-[500px]">
                        <SpotlightCard
                            title="Revenue Core"
                            subtitle="Real-time cashflow visualization."
                            icon={Wallet}
                            glowColor="green"
                            className="h-full"
                        >
                            <FinanceReactor />
                        </SpotlightCard>
                    </div>
                </div>
            </section>

            {/* Feature 03: Network */}
            <section className="py-32 px-6">
                <SectionHeader
                    number="03"
                    title="GLOBAL NETWORK"
                    description={<>DOMINATE THE <span className="text-amber-500">LEADERBOARD</span></>}
                    align="center"
                />

                <div className="max-w-5xl mx-auto h-[500px]">
                    <SpotlightCard
                        title="Worldwide Connectivity"
                        subtitle="Compete with top 1% performers across 140+ countries. Validate your hustle."
                        icon={Globe}
                        glowColor="amber"
                        className="h-full"
                    >
                        <HoloGlobe />
                    </SpotlightCard>
                </div>
            </section>

            {/* Feature 04: AI & Footer */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/10 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                        <div>
                            <SectionHeader
                                number="04"
                                title="GHOST CEO AI"
                                description={<>YOUR DIGITAL <span className="text-purple-500">STRATEGIST</span></>}
                            />
                            <p className="text-zinc-400 text-lg">
                                An always-online intelligence that analyzes your daily metrics and provides actionable strategy adjustments.
                                It doesn't just track data—it gives orders.
                            </p>
                        </div>
                        <div className="h-[400px]">
                            <SpotlightCard
                                title="Neural Analysis"
                                subtitle="Proprietary algorithms detect inefficiency in your workflow."
                                icon={Bot}
                                glowColor="purple"
                                className="h-full"
                            >
                                <NeuralWeb />
                            </SpotlightCard>
                        </div>
                    </div>

                    {/* Footer Content */}
                    <div className="border-t border-white/10 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight text-white mb-2">HUSTLY</h3>
                            <p className="text-zinc-500 text-sm">© 2024 System Inc.</p>
                        </div>
                        <div className="flex gap-8 text-sm text-zinc-400">
                            <a href="#" className="hover:text-amber-500 transition-colors">Manifesto</a>
                            <a href="#" className="hover:text-amber-500 transition-colors">Pricing</a>
                            <a href="#" className="hover:text-amber-500 transition-colors">Login</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono text-green-500">ALL SYSTEMS OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
