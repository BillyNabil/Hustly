"use client";

import { useState, useEffect, memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
    TrendingUp,
    TrendingDown,
    Zap,
    Clock,
    Target,
    DollarSign,
    Calendar,
    Flame,
    BarChart3,
    PieChart,
    Activity,
    Award,
    CheckCircle,
} from "lucide-react";
import { transitions, fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import { getAnalyticsData, AnalyticsData, getDashboardStats, DashboardStats } from "@/lib/supabase-service";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: typeof Zap;
    trend?: number;
    colorClass: string;
    iconBgClass: string;
}

const StatCard = memo(function StatCard({ title, value, subtitle, icon: Icon, trend, colorClass, iconBgClass }: StatCardProps) {
    return (
        <motion.div
            variants={scaleIn}
            className="relative overflow-hidden p-6 bg-[#0F0F0F] border border-white/5 rounded-2xl hover:border-white/10 transition-all group"
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={80} className="text-white transform translate-x-1/3 -translate-y-1/3" />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${iconBgClass} backdrop-blur-xl border border-white/10`}>
                    <Icon size={20} className="text-white" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{value}</h3>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">{title}</p>
                {subtitle && <p className="text-[10px] text-zinc-600 font-mono">{subtitle}</p>}
            </div>
        </motion.div>
    );
});

interface ChartBarProps {
    label: string;
    value: number;
    maxValue: number;
}

const ChartBar = memo(function ChartBar({ label, value, maxValue }: ChartBarProps) {
    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

    return (
        <div className="flex flex-col items-center gap-3 group flex-1">
            <div className="relative w-full h-32 bg-white/[0.02] rounded-lg overflow-hidden flex items-end justify-center group-hover:bg-white/[0.04] transition-colors">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full mx-1 bg-gradient-to-t from-primary/80 to-primary/20 rounded-t-sm group-hover:from-primary group-hover:to-primary/40 transition-all"
                />
            </div>
            <span className="text-[10px] uppercase font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">{label}</span>
        </div>
    );
});

interface ProductivityChartProps {
    data: { date: string; score: number }[];
}

const ProductivityChart = memo(function ProductivityChart({ data }: ProductivityChartProps) {
    const maxValue = Math.max(...data.map(d => d.score), 100); // Default max to 100 if data is 0
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div
            className="p-6 bg-[#0F0F0F] border border-white/5 rounded-2xl h-full flex flex-col"
            role="figure"
            aria-label="Weekly Productivity Chart"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20" aria-hidden="true">
                    <BarChart3 size={16} className="text-yellow-500" />
                </div>
                <h3 className="font-bold text-white text-sm">Weekly Productivity</h3>
            </div>

            <div className="flex-1 flex items-end justify-between gap-2 min-h-[150px]">
                {data.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">
                        No data available
                    </div>
                ) : (
                    data.map((day) => {
                        const dayOfWeek = new Date(day.date).getDay();
                        return (
                            <ChartBar
                                key={day.date}
                                label={dayLabels[dayOfWeek]}
                                value={day.score}
                                maxValue={maxValue}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
});

interface IncomeExpenseChartProps {
    data: { date: string; income: number; expense: number }[];
}

const IncomeExpenseChart = memo(function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
    const totals = useMemo(() => {
        const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
        const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);
        const net = totalIncome - totalExpense;
        return { totalIncome, totalExpense, net };
    }, [data]);

    const totalVolume = totals.totalIncome + totals.totalExpense;
    const incomePercent = totalVolume > 0 ? (totals.totalIncome / totalVolume) * 100 : 50;

    return (
        <div
            className="p-6 bg-[#0F0F0F] border border-white/5 rounded-2xl h-full flex flex-col justify-between"
            role="figure"
            aria-label="Income vs Expense Chart"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20" aria-hidden="true">
                    <PieChart size={16} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-white text-sm">Income vs Expense</h3>
            </div>

            <div className="space-y-8">
                {/* Bar */}
                <div className="relative pt-2" aria-hidden="true">
                    <div className="h-4 bg-zinc-900 rounded-full overflow-hidden flex ring-1 ring-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${incomePercent}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="bg-emerald-500 h-full relative group"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${100 - incomePercent}%` }}
                            transition={{ duration: 1, ease: "circOut", delay: 0.2 }}
                            className="bg-rose-500 h-full relative group"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-8">
                    <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/10 text-center">
                        <p className="text-[10px] font-bold uppercase text-emerald-500/70 mb-1">Income</p>
                        <p className="text-lg font-bold text-emerald-500">${totals.totalIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-500/5 rounded-xl p-3 border border-rose-500/10 text-center">
                        <p className="text-[10px] font-bold uppercase text-rose-500/70 mb-1">Expense</p>
                        <p className="text-lg font-bold text-rose-500">${totals.totalExpense.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5 text-center">
                        <p className="text-[10px] font-bold uppercase text-zinc-500 mb-1">Net</p>
                        <p className={`text-lg font-bold ${totals.net >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            ${totals.net.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
});

interface InsightCardProps {
    title: string;
    description: string;
    icon: typeof Zap;
    iconBgClass: string;
    iconColorClass: string;
}

const InsightCard = memo(function InsightCard({ title, description, icon: Icon, iconBgClass, iconColorClass }: InsightCardProps) {
    return (
        <motion.div
            variants={fadeUp}
            whileHover={{ y: -2 }}
            className="flex items-start gap-4 p-5 bg-[#0F0F0F] border border-white/5 rounded-xl hover:bg-[#121212] transition-colors"
        >
            <div className={`p-3 rounded-xl ${iconBgClass} border border-white/5`}>
                <Icon size={18} className={iconColorClass} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
});

interface CircularProgressProps {
    value: number;
    label: string;
    color: string;
    suffix?: string;
}

const CircularProgress = memo(function CircularProgress({ value, label, color, suffix = "" }: CircularProgressProps) {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div
            className="flex flex-col items-center justify-center"
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={label}
        >
            <div className="relative w-20 h-20 mb-3 flex items-center justify-center" aria-hidden="true">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                    />
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-white" style={{ color }}>{value}{suffix}</span>
                </div>
            </div>
            <p className="text-xs text-zinc-500 font-medium" aria-hidden="true">{label}</p>
        </div>
    );
});

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [analyticsData, statsData] = await Promise.all([
                    getAnalyticsData(),
                    getDashboardStats(),
                ]);
                setAnalytics(analyticsData);
                setDashboardStats(statsData);
            } catch (err) {
                console.error("Failed to load analytics data", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse">Analyzing Data...</p>
                </div>
            </div>
        );
    }

    if (!analytics || !dashboardStats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Unable to load analytics</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 max-w-[1600px] mx-auto w-full">
            {/* Top Stats Row */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <StatCard
                    title="Productivity Score"
                    value={dashboardStats.productivityScore}
                    subtitle={dashboardStats.hustleLevel}
                    icon={Zap}
                    colorClass="text-purple-500"
                    iconBgClass="bg-purple-500"
                />
                <StatCard
                    title="Tasks Completed"
                    value={dashboardStats.tasksCompleted}
                    subtitle={`${analytics.taskCompletionRate}% completion rate`}
                    icon={Target}
                    trend={analytics.taskCompletionRate > 70 ? 12 : -5}
                    colorClass="text-sky-500"
                    iconBgClass="bg-sky-500"
                />
                <StatCard
                    title="Monthly Income"
                    value={`$${dashboardStats.monthlyIncome.toLocaleString()}`}
                    icon={DollarSign}
                    colorClass="text-green-500"
                    iconBgClass="bg-green-500"
                />
                <StatCard
                    title="Focus Hours"
                    value={`${dashboardStats.focusHours}h`}
                    subtitle={`${analytics.totalFocusHoursThisWeek}h this week`}
                    icon={Clock}
                    colorClass="text-orange-500"
                    iconBgClass="bg-orange-500"
                />
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProductivityChart
                    data={analytics.weeklyProductivity}
                />
                <IncomeExpenseChart data={analytics.incomeVsExpense} />
            </div>

            {/* Insights and Recommendations */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 px-1">
                    <Award size={18} className="text-primary" />
                    <h2 className="text-base font-bold text-white">Insights & Recommendations</h2>
                </div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <InsightCard
                        title={`${analytics.mostProductiveDay} is your best day`}
                        description="You consistently perform better on this day. Schedule important tasks here!"
                        icon={Calendar}
                        iconBgClass="bg-blue-500/10"
                        iconColorClass="text-blue-500"
                    />
                    <InsightCard
                        title={`${analytics.habitCompletionRate}% habit completion`}
                        description="Try to complete more habits daily for better streaks."
                        icon={Flame}
                        iconBgClass="bg-orange-500/10"
                        iconColorClass="text-orange-500"
                    />
                    <InsightCard
                        title={`${analytics.averageDailyScore} avg daily score`}
                        description="Focus on completing more tasks to boost your score."
                        icon={Zap}
                        iconBgClass="bg-yellow-500/10"
                        iconColorClass="text-yellow-500"
                    />
                    <InsightCard
                        title={`${analytics.totalFocusHoursThisWeek}h focus this week`}
                        description="Try to increase your focus sessions for better results."
                        icon={Clock}
                        iconBgClass="bg-amber-500/10"
                        iconColorClass="text-amber-500"
                    />
                </motion.div>
            </div>

            {/* Goals Progress Footer */}
            <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <Target size={16} className="text-primary" />
                        </div>
                        <h3 className="font-bold text-white text-sm">Goals Progress</h3>
                    </div>
                    <span className="text-xs text-zinc-500">{analytics.goalsCompletedThisMonth} completed this month</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CircularProgress
                        value={dashboardStats.activeGoals}
                        label="Active Goals"
                        color="#EAB308" // Primary Yellow
                    />
                    <CircularProgress
                        value={analytics.goalsCompletedThisMonth}
                        label="Completed"
                        color="#22C55E" // Green
                    />
                    <CircularProgress
                        value={analytics.habitCompletionRate}
                        label="Habit Rate"
                        color="#F59E0B" // Amber
                        suffix="%"
                    />
                </div>
            </div>
        </div>
    );
}
