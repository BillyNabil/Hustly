"use client";

import { memo, useMemo, useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
    TrendingUp,
    DollarSign,
    Zap,
    Target,
    AlertCircle,
    Briefcase,
    CheckCircle2,
    Clock,
    ArrowRight,
    Trophy,
    Flame,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { fadeUp, staggerContainer, transitions } from "@/lib/animations";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { getDashboardStats, getRecentTasks, DashboardStats } from "@/lib/supabase-service";
import { Idea } from "@/lib/database.types";
import { ModernBackground } from "@/components/ModernBackground";
import DashboardVisualizer from "@/components/DashboardVisualizer";

// Only lazy-load non-critical below-the-fold component
const Leaderboard = dynamic(() => import("@/components/Leaderboard"), {
    loading: () => <div className="glass-panel rounded-2xl border border-primary/10 p-6 h-64 animate-pulse bg-white/5" />,
    ssr: false
});

export default function Home() {
    const { t, language } = useLanguage();
    const { user, profile } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentTasks, setRecentTasks] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard data from Supabase with timeout
    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            // Create a timeout promise
            const timeout = new Promise<null>((resolve) => {
                setTimeout(() => resolve(null), 5000);
            });

            try {
                // Race between actual fetch and timeout
                const result = await Promise.race([
                    Promise.all([getDashboardStats(), getRecentTasks()]),
                    timeout.then(() => null)
                ]);

                if (result) {
                    const [statsData, tasksData] = result;
                    setStats(statsData);
                    setRecentTasks(tasksData);
                } else {
                    // Timeout - show empty state
                    console.warn('Dashboard data fetch timeout');
                    setStats({
                        productivityScore: 0,
                        monthlyIncome: 0,
                        monthlyExpense: 0,
                        hustleLevel: "Newbie Hustler",
                        tasksCompleted: 0,
                        focusHours: 0,
                        activeGoals: 0,
                    });
                }
            } catch (error) {
                console.error('Dashboard fetch error:', error);
                setStats({
                    productivityScore: 0,
                    monthlyIncome: 0,
                    monthlyExpense: 0,
                    hustleLevel: "Newbie Hustler",
                    tasksCompleted: 0,
                    focusHours: 0,
                    activeGoals: 0,
                });
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    // Ghost CEO Alerts - will be populated from database later
    type Alert = { id: number; type: string; message: string; detail: string; time: string };
    const ghostCEOAlerts = useMemo<Alert[]>(() => [], []);

    // Opportunities Feed - will be populated from database later
    type Opportunity = { id: number; title: string; source: string; budget: string; match: string; keyword: string };
    const opportunities = useMemo<Opportunity[]>(() => [], []);

    // Non-blocking render approach for better LCP
    // We render the layout immediately and show skeletons/default values while loading
    const showSkeleton = loading || !stats;

    // Default empty stats if loading (Visualizer handles nulls gracefully)
    const displayStats = stats || {
        productivityScore: 0,
        monthlyIncome: 0,
        monthlyExpense: 0,
        hustleLevel: "Loading...",
        tasksCompleted: 0,
        focusHours: 0,
        activeGoals: 0,
    };

    return (
        <div className="relative min-h-full overflow-y-auto overflow-x-hidden">
            {/* Background */}
            <ModernBackground className="fixed inset-0 z-0 opacity-60 pointer-events-none" />
            <div className="fixed inset-0 z-0 bg-background/50 pointer-events-none backdrop-blur-[1px]" />

            <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-8">

                {/* Visualizer */}
                <DashboardVisualizer stats={displayStats} />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back, <span className="text-primary">{profile?.full_name || user?.email?.split("@")[0] || t.dashboard.hustler}</span>
                        </h1>
                        <p className="text-muted-foreground">{t.dashboard.empireWaiting}</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 self-start md:self-auto">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-medium text-primary">System Online</span>
                    </div>
                </div>

                {/* Stats Grid - Using stagger for smooth sequential animation */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={fadeUp}
                        className="glass-panel p-5 rounded-2xl border border-primary/10 card-hover gpu-accelerate"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.dashboard.score}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{displayStats.productivityScore}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.dashboard.thisWeek}</p>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="glass-panel p-5 rounded-2xl border border-green-500/10 card-hover gpu-accelerate"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.dashboard.income}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">${displayStats.monthlyIncome.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.dashboard.thisMonth}</p>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="glass-panel p-5 rounded-2xl border border-purple-500/10 card-hover gpu-accelerate"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                <Clock className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.dashboard.focus}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{displayStats.focusHours}h</p>
                        <p className="text-xs text-purple-400 font-medium mt-1">{t.dashboard.thisMonth}</p>
                    </motion.div>

                    <motion.div
                        variants={fadeUp}
                        className="glass-panel p-5 rounded-2xl border border-primary/20 card-hover gpu-accelerate"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                <Flame className="w-4 h-4 text-black" />
                            </div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{t.dashboard.level}</span>
                        </div>
                        <p className="text-lg font-bold text-gradient-gold">{displayStats.hustleLevel}</p>
                        <p className="text-xs text-muted-foreground mt-1">{displayStats.tasksCompleted} tasks completed</p>
                    </motion.div>
                </motion.div>

                {/* Main Content Grid */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Left Column - Alerts & Opportunities */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ghost CEO Alerts */}
                        <motion.div
                            variants={fadeUp}
                            className="glass-panel rounded-2xl border border-primary/10 overflow-hidden gpu-accelerate"
                        >
                            <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                    <h3 className="font-semibold text-white">{t.dashboard.ghostCeoAlerts}</h3>
                                </div>
                                <Link href="/chat" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    {t.common.viewAll} <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="p-4 space-y-3">
                                {ghostCEOAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                                    >
                                        <span className="text-xl">🚨</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-medium">{alert.message}</p>
                                            <p className="text-xs text-muted-foreground">{alert.detail}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Opportunities Feed */}
                        <motion.div
                            variants={fadeUp}
                            className="glass-panel rounded-2xl border border-primary/10 overflow-hidden gpu-accelerate"
                        >
                            <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-blue-400" />
                                    <h3 className="font-semibold text-white">{t.dashboard.opportunitiesFeed}</h3>
                                </div>
                                <span className="text-xs text-muted-foreground">{t.dashboard.basedOnIdeas}</span>
                            </div>
                            <div className="p-4 space-y-3">
                                {opportunities.map((opp) => (
                                    <div
                                        key={opp.id}
                                        className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 cursor-pointer hover:bg-blue-500/15 transition-colors"
                                    >
                                        <span className="text-xl">💼</span>
                                        <div className="flex-1">
                                            <p className="text-sm text-white font-medium">{opp.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {opp.source} • {opp.budget} • Match: &quot;{opp.keyword}&quot;
                                            </p>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${opp.match === "High"
                                            ? "bg-green-500/20 text-green-400"
                                            : "bg-primary/20 text-primary"
                                            }`}>
                                            {opp.match}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Tasks */}
                        <motion.div
                            variants={fadeUp}
                            className="glass-panel rounded-2xl border border-primary/10 overflow-hidden gpu-accelerate"
                        >
                            <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-primary" />
                                    <h3 className="font-semibold text-white">{t.dashboard.recentTasks}</h3>
                                </div>
                                <Link href="/ideas" className="text-xs text-primary hover:underline flex items-center gap-1">
                                    {t.dashboard.viewBoard} <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="p-4 space-y-2">
                                {recentTasks.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted-foreground text-sm">No tasks yet</p>
                                        <Link href="/ideas" className="text-primary text-xs hover:underline">
                                            Add your first idea →
                                        </Link>
                                    </div>
                                ) : (
                                    recentTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            {task.status === "done" ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                            ) : task.status === "in_progress" ? (
                                                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                                            )}
                                            <span className={`text-sm ${task.status === "done" ? "text-muted-foreground line-through" : "text-white"}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Leaderboard */}
                    <motion.div variants={fadeUp} className="gpu-accelerate">
                        <Leaderboard showFull={false} />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
