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
} from "lucide-react";
import { transitions, fadeUp, staggerContainer } from "@/lib/animations";
import { getAnalyticsData, AnalyticsData, getDashboardStats, DashboardStats } from "@/lib/supabase-service";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: typeof TrendingUp;
    trend?: number;
    color: string;
}

const StatCard = memo(function StatCard({ title, value, subtitle, icon: Icon, trend, color }: StatCardProps) {
    return (
        <motion.div
            variants={fadeUp}
            className="p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${color}`}>
                    <Icon size={20} className="text-white" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? "text-green-500" : "text-red-500"
                        }`}>
                        {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
            <p className="text-sm text-muted-foreground">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </motion.div>
    );
});

interface ChartBarProps {
    label: string;
    value: number;
    maxValue: number;
    color: string;
}

const ChartBar = memo(function ChartBar({ label, value, maxValue, color }: ChartBarProps) {
    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-8 h-32 bg-muted rounded-lg overflow-hidden">
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`absolute bottom-0 left-0 right-0 ${color} rounded-lg`}
                />
            </div>
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xs font-medium text-foreground">{value}</span>
        </div>
    );
});

interface ProductivityChartProps {
    data: { date: string; score: number }[];
    title: string;
}

const ProductivityChart = memo(function ProductivityChart({ data, title }: ProductivityChartProps) {
    const maxValue = Math.max(...data.map(d => d.score), 1);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="p-5 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <BarChart3 size={18} className="text-primary" />
                    {title}
                </h3>
            </div>
            <div className="flex items-end justify-between gap-2">
                {data.slice(-7).map((day, index) => {
                    const dayOfWeek = new Date(day.date).getDay();
                    return (
                        <ChartBar
                            key={day.date}
                            label={dayLabels[dayOfWeek]}
                            value={day.score}
                            maxValue={maxValue}
                            color="bg-gradient-to-t from-primary to-primary/60"
                        />
                    );
                })}
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

    const incomePercent = totals.totalIncome + totals.totalExpense > 0
        ? (totals.totalIncome / (totals.totalIncome + totals.totalExpense)) * 100
        : 50;

    return (
        <div className="p-5 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <PieChart size={18} className="text-green-500" />
                    Income vs Expense
                </h3>
            </div>

            {/* Visual representation */}
            <div className="mb-4">
                <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${incomePercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                    />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${100 - incomePercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-red-500 to-rose-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Income</p>
                    <p className="text-lg font-bold text-green-500">
                        ${totals.totalIncome.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Expense</p>
                    <p className="text-lg font-bold text-red-500">
                        ${totals.totalExpense.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Net</p>
                    <p className={`text-lg font-bold ${totals.net >= 0 ? "text-green-500" : "text-red-500"}`}>
                        ${totals.net.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
});

interface InsightCardProps {
    title: string;
    description: string;
    icon: typeof TrendingUp;
    color: string;
}

const InsightCard = memo(function InsightCard({ title, description, icon: Icon, color }: InsightCardProps) {
    return (
        <motion.div
            variants={fadeUp}
            className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl"
        >
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={16} className="text-white" />
            </div>
            <div>
                <h4 className="font-medium text-foreground text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </motion.div>
    );
});

export default function AnalyticsDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<"week" | "month">("week");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [analyticsData, statsData] = await Promise.all([
                getAnalyticsData(),
                getDashboardStats(),
            ]);
            setAnalytics(analyticsData);
            setDashboardStats(statsData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!analytics || !dashboardStats) {
        return (
            <div className="text-center py-12">
                <Activity size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Unable to load analytics</p>
            </div>
        );
    }

    const insights = [
        {
            title: `${analytics.mostProductiveDay} is your best day`,
            description: "You consistently perform better on this day. Schedule important tasks here!",
            icon: Calendar,
            color: "bg-blue-500",
        },
        {
            title: `${analytics.habitCompletionRate}% habit completion`,
            description: analytics.habitCompletionRate >= 80
                ? "Amazing consistency! Keep it up!"
                : "Try to complete more habits daily for better streaks.",
            icon: Flame,
            color: analytics.habitCompletionRate >= 80 ? "bg-green-500" : "bg-orange-500",
        },
        {
            title: `${analytics.averageDailyScore} avg daily score`,
            description: analytics.averageDailyScore >= 50
                ? "Great productivity! You're crushing it!"
                : "Focus on completing more tasks to boost your score.",
            icon: Zap,
            color: analytics.averageDailyScore >= 50 ? "bg-purple-500" : "bg-yellow-500",
        },
        {
            title: `${analytics.totalFocusHoursThisWeek}h focus this week`,
            description: analytics.totalFocusHoursThisWeek >= 20
                ? "Excellent focus time! Deep work mode activated."
                : "Try to increase your focus sessions for better results.",
            icon: Clock,
            color: analytics.totalFocusHoursThisWeek >= 20 ? "bg-green-500" : "bg-amber-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="text-primary" />
                        Analytics
                    </h1>
                    <p className="text-muted-foreground">Track your productivity and growth</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTimeRange("week")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === "week"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => setTimeRange("month")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === "month"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Month
                    </button>
                </div>
            </div>

            {/* Main Stats */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <StatCard
                    title="Productivity Score"
                    value={dashboardStats.productivityScore}
                    subtitle={dashboardStats.hustleLevel}
                    icon={Zap}
                    color="bg-gradient-to-br from-violet-500 to-purple-600"
                />
                <StatCard
                    title="Tasks Completed"
                    value={dashboardStats.tasksCompleted}
                    subtitle={`${analytics.taskCompletionRate}% completion rate`}
                    icon={Target}
                    trend={analytics.taskCompletionRate > 70 ? 12 : -5}
                    color="bg-gradient-to-br from-blue-500 to-cyan-600"
                />
                <StatCard
                    title="Monthly Income"
                    value={`$${dashboardStats.monthlyIncome.toLocaleString()}`}
                    icon={DollarSign}
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                />
                <StatCard
                    title="Focus Hours"
                    value={`${dashboardStats.focusHours}h`}
                    subtitle={`${analytics.totalFocusHoursThisWeek}h this week`}
                    icon={Clock}
                    color="bg-gradient-to-br from-orange-500 to-amber-600"
                />
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProductivityChart
                    data={timeRange === "week" ? analytics.weeklyProductivity : analytics.monthlyProductivity}
                    title={timeRange === "week" ? "Weekly Productivity" : "Monthly Productivity"}
                />
                <IncomeExpenseChart data={analytics.incomeVsExpense} />
            </div>

            {/* Insights */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    Insights & Recommendations
                </h2>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    {insights.map((insight, index) => (
                        <InsightCard key={index} {...insight} />
                    ))}
                </motion.div>
            </div>

            {/* Goals Progress */}
            <div className="p-5 bg-card border border-border rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Target size={18} className="text-primary" />
                        Goals Progress
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        {analytics.goalsCompletedThisMonth} completed this month
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">{dashboardStats.activeGoals}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Active Goals</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-green-500">{analytics.goalsCompletedThisMonth}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-amber-500">{analytics.habitCompletionRate}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Habit Rate</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
