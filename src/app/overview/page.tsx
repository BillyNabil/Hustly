"use client";

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    Lightbulb,
    Wallet,
    Target,
    Bot,
    Timer,
    Flame,
    BarChart3,
    Trophy,
    Zap,
    Crown,
    CalendarCheck,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Users,
    Clock,
    CheckCircle2,
    Star,
    Rocket,
    Brain
} from "lucide-react";
import { fadeUp, staggerContainer, transitions, easings } from "@/lib/animations";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { getDashboardStats, DashboardStats } from "@/lib/supabase-service";

// Feature cards data
const features = [
    {
        key: "ideas",
        href: "/ideas",
        icon: Lightbulb,
        title: "Idea Board",
        description: "Capture bursts of inspiration",
        color: "bg-yellow-500",
        text: "text-yellow-500",
        delay: 0.1
    },
    {
        key: "schedule",
        href: "/schedule",
        icon: Timer,
        title: "Time Blocking",
        description: "Master your daily schedule",
        color: "bg-violet-500",
        text: "text-violet-500",
        delay: 0.2
    },
    {
        key: "habits",
        href: "/habits",
        icon: Flame,
        title: "Habit Tracker",
        description: "Build unbreakable routines",
        color: "bg-red-500",
        text: "text-red-500",
        delay: 0.3
    },
    {
        key: "goals",
        href: "/goals",
        icon: CalendarCheck,
        title: "Goals",
        description: "Visualize and reach milestones",
        color: "bg-blue-500",
        text: "text-blue-500",
        delay: 0.4
    },
    {
        key: "finance",
        href: "/finance",
        icon: Wallet,
        title: "Finance",
        description: "Track income and expenses",
        color: "bg-emerald-500",
        text: "text-emerald-500",
        delay: 0.5
    },
    {
        key: "vision",
        href: "/vision",
        icon: Target,
        title: "Vision Board",
        description: "Manifest your dream life",
        color: "bg-purple-500",
        text: "text-purple-500",
        delay: 0.6
    },
    {
        key: "analytics",
        href: "/analytics",
        icon: BarChart3,
        title: "Analytics",
        description: "Data-driven growth insights",
        color: "bg-cyan-500",
        text: "text-cyan-500",
        delay: 0.7
    },
    {
        key: "chat",
        href: "/chat",
        icon: Bot,
        title: "Ghost CEO",
        description: "AI strategic advisor",
        color: "bg-primary",
        text: "text-primary",
        delay: 0.8
    },
];

// Modern refined card component
const FeatureCard = memo(function FeatureCard({
    feature,
}: {
    feature: typeof features[0];
}) {
    const Icon = feature.icon;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
        >
            <Link
                href={feature.href}
                className="group relative flex flex-col h-full p-6 rounded-3xl bg-card/40 hover:bg-card/60 border border-border/50 hover:border-primary/20 backdrop-blur-xl transition-all duration-300 overflow-hidden"
            >
                {/* Dynamic Gradient Background on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${feature.color}`} />

                <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-2xl bg-card/50 border border-border/50 ${feature.text} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon strokeWidth={2} className="w-6 h-6" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className={`w-5 h-5 ${feature.text}`} />
                    </div>
                </div>

                <div className="mt-auto">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:tracking-wide transition-all">
                        {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        {feature.description}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
});

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.4, ease: easings.easeOut }}
        className="flex items-center gap-4 p-4 rounded-2xl bg-card/30 border border-border/50 backdrop-blur-md"
    >
        <div className={`p-3 rounded-xl bg-card/50 ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
            <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
    </motion.div>
);

// Quick Action Pill
const QuickAction = ({ icon: Icon, label, href }: { icon: any, label: string, href: string }) => (
    <Link href={href}>
        <motion.div
            whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary) / 0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-card/30 border border-border/50 hover:border-primary/30 transition-colors gap-2 cursor-pointer"
        >
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-foreground/80">{label}</span>
        </motion.div>
    </Link>
);

const RotatingOrbit = ({ radius, duration, reverse = false, color, icon: Icon, delay = 0 }: any) => (
    <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
        style={{ width: radius * 2, height: radius * 2 }}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear", delay: -delay }}
    >
        <motion.div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${color} flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
            animate={{ rotate: reverse ? 360 : -360 }}
            transition={{ duration, repeat: Infinity, ease: "linear", delay: -delay }}
        >
            <Icon className="w-4 h-4 text-white" />
        </motion.div>
    </motion.div>
);


const MomentumVisualizer = () => {
    return (
        <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-24 mb-8 rounded-3xl bg-card/30 border border-white/5 overflow-hidden flex items-center justify-between px-8 md:px-16"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse-slow" />

            {/* Label */}
            <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Live Momentum</span>
            </div>

            {/* Wave Bars */}
            <div className="flex items-end justify-between w-full h-12 gap-1 md:gap-2 opacity-80">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1.5 md:w-2 rounded-t-full bg-gradient-to-t from-primary/10 to-primary"
                        animate={{
                            height: ["20%", "90%", "30%", "60%", "20%"],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.15,
                            repeatType: "mirror"
                        }}
                        style={{
                            display: i % 2 !== 0 && window.innerWidth < 768 ? 'none' : 'block' // Show fewer bars on mobile
                        }}
                    />
                ))}
            </div>

            {/* Overlay Gradient for Fade effect at edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </motion.section>
    );
};

const TargetingHUD = () => {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative h-48 mb-12 rounded-3xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center"
        >
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

            {/* Scanning Line */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_20px_rgba(253,186,116,0.5)] z-10"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Central Target */}
            <div className="relative z-20 flex flex-col items-center gap-4">
                <div className="relative w-24 h-24 border border-primary/30 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin-slow" />
                    <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                    </div>

                    {/* Crosshairs */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-[1px] h-4 bg-primary/50" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-[1px] h-4 bg-primary/50" />
                    <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-4 h-[1px] bg-primary/50" />
                    <div className="absolute right-0 top-1/2 translate-x-2 -translate-y-1/2 w-4 h-[1px] bg-primary/50" />
                </div>

                <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold mb-1">Mission Control</p>
                    <p className="text-xs text-muted-foreground">Scanning for Opportunities...</p>
                </div>
            </div>

            {/* Random Blips */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-green-400 rounded-full"
                    style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: Math.random() * 8,
                        repeatDelay: Math.random() * 8
                    }}
                />
            ))}
        </motion.section>
    );
};

export default function OverviewPage() {
    const { user, profile } = useAuth();
    const { t } = useLanguage();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        async function fetchStats() {
            const data = await getDashboardStats();
            setStats(data);
        }
        fetchStats();

        // Real-time clock
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Update every second for smoother feel if we add seconds, but fine for now
        return () => clearInterval(timer);
    }, []);

    const displayName = profile?.full_name || user?.email?.split("@")[0] || "Hustler";
    const hour = currentTime.getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

    // Formatting date
    const dateString = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-full pb-20 overflow-x-hidden">
            {/* Ambient Background Lights */}
            <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="px-6 md:px-12 pt-10">
                {/* Header Section */}
                <header className="max-w-7xl mx-auto mb-16">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            className="space-y-2"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                    {dateString}
                                </span>
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight overflow-hidden flex flex-wrap gap-x-3 gap-y-1">
                                <motion.span
                                    className="flex overflow-hidden"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                                    }}
                                >
                                    {greeting.split("").map((char, index) => (
                                        <motion.span
                                            key={index}
                                            variants={{
                                                hidden: { y: "100%" },
                                                visible: { y: 0, transition: { ease: [0.33, 1, 0.68, 1], duration: 0.5 } }
                                            }}
                                            className="inline-block"
                                        >
                                            {char === " " ? "\u00A0" : char}
                                        </motion.span>
                                    ))}
                                </motion.span>

                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                                    className="text-gradient-gold relative"
                                >
                                    {displayName}
                                    <motion.span
                                        className="absolute -bottom-2 left-0 w-full h-1 bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                                    />
                                </motion.span>
                            </h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 1 }}
                                className="text-lg text-muted-foreground flex items-center gap-2"
                            >
                                <span className="inline-block">Let's make today count.</span>
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 1.5, type: "spring" }}
                                >
                                    <Rocket className="w-5 h-5 text-orange-500" />
                                </motion.div>
                            </motion.div>
                        </motion.div>

                        {/* Quick Stats Banner */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...transitions.smooth, delay: 0.2 }}
                            className="flex flex-wrap gap-3"
                        >
                            <StatCard
                                icon={TrendingUp}
                                label="Productivity"
                                value={stats?.productivityScore || 0}
                                color="text-green-500"
                                delay={0.3}
                            />
                            <StatCard
                                icon={Clock}
                                label="Focus Hours"
                                value={`${stats?.focusHours || 0}h`}
                                color="text-violet-500"
                                delay={0.4}
                            />
                            <StatCard
                                icon={CheckCircle2}
                                label="Tasks Done"
                                value={stats?.tasksCompleted || 0}
                                color="text-blue-500"
                                delay={0.5}
                            />
                        </motion.div>
                    </div>
                </header>

                {/* Main Content Grid */}
                <main className="max-w-7xl mx-auto">
                    {/* Momentum Visualizer */}
                    <MomentumVisualizer />

                    {/* System Overview Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <div className="relative p-8 rounded-3xl bg-card/30 border border-white/5 backdrop-blur-xl overflow-hidden">
                            {/* Background Gradients */}
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <div className="flex-1 text-center md:text-left">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium uppercase tracking-widest text-muted-foreground mb-4"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        System Overview
                                    </motion.div>

                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                        The Ultimate OS for <br className="hidden md:block" />
                                        <span className="text-gradient-gold">Building Your Empire</span>
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
                                        Hustly is an ecosystem designed to align your daily actions with your life vision.
                                        Plan your strategy, track your finances, and execute habits—all in one place.
                                    </p>
                                </div>

                                <div className="flex-1 w-full max-w-md">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Target, label: "Vision", desc: "Long-term Goals", color: "text-purple-400", bg: "bg-purple-500/10" },
                                            { icon: Zap, label: "Execution", desc: "Daily Tasks", color: "text-amber-400", bg: "bg-amber-500/10" },
                                            { icon: TrendingUp, label: "Growth", desc: "Analytics & Finance", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                                            { icon: Brain, label: "Intelligence", desc: "AI Strategy", color: "text-blue-400", bg: "bg-blue-500/10" },
                                        ].map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.6 + (i * 0.1) }}
                                                className="p-4 rounded-2xl bg-background/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3"
                                            >
                                                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
                                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-foreground">{item.label}</h3>
                                                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>


                    {/* Mission Control HUD */}
                    <TargetingHUD />

                    <div className="space-y-12">
                        {/* Tools Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Brain className="w-6 h-6 text-primary" />
                                    Command Center
                                </h2>
                            </div>

                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {features.map((feature) => (
                                    <FeatureCard key={feature.key} feature={feature} />
                                ))}
                            </motion.div>
                        </section>

                        {/* Ecosystem Visualizer */}
                        <section className="relative h-[350px] w-full rounded-3xl bg-black/40 border border-white/5 overflow-hidden flex items-center justify-center group">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />

                            {/* Particles Background */}
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={`particle-${i}`}
                                    className="absolute rounded-full bg-white/10"
                                    style={{
                                        width: Math.random() * 3 + 1,
                                        height: Math.random() * 3 + 1,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -30],
                                        opacity: [0, 0.5, 0],
                                    }}
                                    transition={{
                                        duration: Math.random() * 3 + 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                        ease: "easeInOut",
                                    }}
                                />
                            ))}

                            {/* Center Core */}
                            <div className="relative z-10 flex flex-col items-center justify-center">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-primary/30 blur-3xl rounded-full"
                                />
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-card to-background border border-primary/20 flex items-center justify-center relative z-10 shadow-2xl">
                                    <Image src="/favicon-96x96.png" width={40} height={40} alt="Hustly" className="opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <div className="mt-8 text-center z-10 pointer-events-none">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">System Status</p>
                                    <p className="text-xl font-bold text-foreground">All Systems <span className="text-green-500">Go</span></p>
                                </div>
                            </div>

                            {/* Orbits */}
                            <RotatingOrbit radius={100} duration={60} color="bg-blue-500/20 backdrop-blur-md border border-blue-500/50" icon={Target} delay={0} />
                            <RotatingOrbit radius={140} duration={80} color="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50" icon={Wallet} reverse delay={5} />
                            <RotatingOrbit radius={180} duration={100} color="bg-purple-500/20 backdrop-blur-md border border-purple-500/50" icon={Bot} delay={12} />
                            <RotatingOrbit radius={220} duration={120} color="bg-red-500/20 backdrop-blur-md border border-red-500/50" icon={Flame} reverse delay={8} />

                            <div className="absolute bottom-4 right-6 text-right z-10">
                                <p className="text-xs text-muted-foreground/50 font-mono">ECOSYSTEM_V1.0</p>
                            </div>
                        </section>

                        {/* Quick Actions Row */}
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Quick Actions</h2>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                            >
                                <QuickAction icon={Zap} label="Challenge" href="/challenges" />
                                <QuickAction icon={Trophy} label="Awards" href="/achievements" />
                                <QuickAction icon={Crown} label="Ranking" href="/leaderboard" />
                                <QuickAction icon={Users} label="Community" href="/leaderboard" />
                                <QuickAction icon={Bot} label="AI Chat" href="/chat" />
                                <QuickAction icon={Target} label="Set Goal" href="/goals" />
                            </motion.div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
