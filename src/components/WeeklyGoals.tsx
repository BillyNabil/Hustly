"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Target,
    X,
    Check,
    Clock,
    DollarSign,
    CheckSquare,
    Flame,
    Timer,
    Edit3,
    Trash2,
    TrendingUp,
    Calendar,
} from "lucide-react";
import { WeeklyGoal, WeeklyGoalType } from "@/lib/database.types";
import { transitions, fadeUp, staggerContainer, modalOverlay, modalContent } from "@/lib/animations";
import {
    getWeeklyGoals,
    createWeeklyGoal,
    updateWeeklyGoalProgress,
} from "@/lib/supabase-service";

const goalTypeConfig: Record<WeeklyGoalType, { icon: typeof Target; color: string; label: string }> = {
    tasks: { icon: CheckSquare, color: "bg-blue-500", label: "Tasks" },
    income: { icon: DollarSign, color: "bg-green-500", label: "Income" },
    habits: { icon: Flame, color: "bg-orange-500", label: "Habits" },
    focus_hours: { icon: Timer, color: "bg-purple-500", label: "Focus Hours" },
    custom: { icon: Target, color: "bg-slate-500", label: "Custom" },
};

interface GoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (goal: Partial<WeeklyGoal>) => void;
}

const GoalModal = memo(function GoalModal({ isOpen, onClose, onSave }: GoalModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalType, setGoalType] = useState<WeeklyGoalType>("tasks");
    const [targetValue, setTargetValue] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            description: description.trim() || null,
            goal_type: goalType,
            target_value: targetValue,
        });

        setTitle("");
        setDescription("");
        setGoalType("tasks");
        setTargetValue(5);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            variants={modalOverlay}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
        >
            <motion.div
                className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
                variants={modalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">New Weekly Goal</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="e.g., Complete 10 tasks"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Description (optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                            placeholder="Add details..."
                            rows={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Goal Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(Object.entries(goalTypeConfig) as [WeeklyGoalType, typeof goalTypeConfig.tasks][]).map(([type, config]) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setGoalType(type)}
                                    className={`flex items-center gap-2 p-3 rounded-xl transition-all ${goalType === type
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border border-border text-foreground hover:bg-muted"
                                        }`}
                                >
                                    <config.icon size={18} />
                                    <span className="text-sm font-medium">{config.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Target Value
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={targetValue}
                                onChange={(e) => setTargetValue(Math.max(1, parseInt(e.target.value) || 1))}
                                min={1}
                                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <span className="text-sm text-muted-foreground">
                                {goalType === "income" && "$"}
                                {goalType === "focus_hours" && "hours"}
                                {(goalType === "tasks" || goalType === "habits") && "times"}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Goal
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
});

interface GoalCardProps {
    goal: WeeklyGoal;
    onUpdateProgress: (goalId: string, newValue: number) => void;
}

const GoalCard = memo(function GoalCard({ goal, onUpdateProgress }: GoalCardProps) {
    const config = goalTypeConfig[goal.goal_type] || goalTypeConfig.custom;
    const progress = Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(goal.current_value);

    const handleSaveProgress = () => {
        onUpdateProgress(goal.id, tempValue);
        setIsEditing(false);
    };

    return (
        <motion.div
            layout
            variants={fadeUp}
            className={`relative p-5 rounded-2xl border transition-all ${goal.is_completed
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-card border-border hover:border-primary/30"
                }`}
        >
            {/* Completed badge */}
            {goal.is_completed && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
                    <Check size={12} />
                    Done!
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-xl ${config.color}`}>
                    <config.icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-foreground mb-1 ${goal.is_completed ? "line-through opacity-70" : ""}`}>
                        {goal.title}
                    </h3>
                    {goal.description && (
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                    )}

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">
                                {goal.current_value} / {goal.target_value}
                                {goal.goal_type === "income" && " $"}
                                {goal.goal_type === "focus_hours" && " hrs"}
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full ${goal.is_completed ? "bg-green-500" : config.color}`}
                            />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                            {progress}% complete
                        </div>
                    </div>

                    {/* Edit progress */}
                    {!goal.is_completed && (
                        <div className="mt-3">
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(Math.max(0, parseInt(e.target.value) || 0))}
                                        min={0}
                                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    />
                                    <button
                                        onClick={handleSaveProgress}
                                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTempValue(goal.current_value);
                                            setIsEditing(false);
                                        }}
                                        className="p-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                                >
                                    <TrendingUp size={16} />
                                    Update Progress
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

interface WeekDisplayProps {
    weekStart: Date;
}

const WeekDisplay = memo(function WeekDisplay({ weekStart }: WeekDisplayProps) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
            <Calendar size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">
                {formatDate(weekStart)} - {formatDate(weekEnd)}
            </span>
        </div>
    );
});

export default function WeeklyGoals() {
    const [goals, setGoals] = useState<WeeklyGoal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const weekStart = useMemo(() => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const weekStart = new Date(now.setDate(diff));
        weekStart.setHours(0, 0, 0, 0);
        return weekStart;
    }, []);

    const fetchGoals = useCallback(async () => {
        setIsLoading(true);
        const data = await getWeeklyGoals();
        setGoals(data);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchGoals();
    }, [fetchGoals]);

    const handleCreateGoal = async (data: Partial<WeeklyGoal>) => {
        const created = await createWeeklyGoal(data);
        if (created) {
            setGoals(prev => [...prev, created]);
        }
    };

    const handleUpdateProgress = async (goalId: string, newValue: number) => {
        const updated = await updateWeeklyGoalProgress(goalId, newValue);
        if (updated) {
            setGoals(prev => prev.map(g => g.id === goalId ? updated : g));
        }
    };

    const stats = useMemo(() => {
        const total = goals.length;
        const completed = goals.filter(g => g.is_completed).length;
        const avgProgress = goals.length > 0
            ? Math.round(goals.reduce((sum, g) => sum + Math.min(100, (g.current_value / g.target_value) * 100), 0) / goals.length)
            : 0;
        return { total, completed, avgProgress };
    }, [goals]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Target className="text-primary" />
                        Weekly Goals
                    </h1>
                    <p className="text-muted-foreground">Set and track your weekly objectives</p>
                </div>
                <div className="flex items-center gap-3">
                    <WeekDisplay weekStart={weekStart} />
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Add Goal</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-card border border-border rounded-2xl text-center">
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-2xl text-center">
                    <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-2xl text-center">
                    <p className="text-3xl font-bold text-primary">{stats.avgProgress}%</p>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
            </div>

            {/* Goals List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : goals.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 px-4 bg-card border border-border rounded-2xl"
                >
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                        <Target size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No weekly goals yet</h3>
                    <p className="text-muted-foreground mb-4">Set your first goal for this week!</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        Create Goal
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {goals.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onUpdateProgress={handleUpdateProgress}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <GoalModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleCreateGoal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
