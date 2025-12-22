"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Check,
    X,
    Flame,
    Target,
    Calendar,
    Trash2,
    Edit3,
    Trophy,
    Zap,
    Star,
    Clock,
} from "lucide-react";
import { Habit, HabitCompletion } from "@/lib/database.types";
import { transitions, fadeUp, staggerContainer, modalOverlay, modalContent } from "@/lib/animations";
import {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    getHabitCompletions,
    completeHabit,
    uncompleteHabit,
} from "@/lib/supabase-service";

const habitIcons = ["🎯", "💪", "📚", "🧘", "💧", "🏃", "💤", "🥗", "✍️", "🎨", "💻", "🎵"];
const habitColors = [
    "bg-gradient-to-r from-violet-500 to-purple-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-green-500 to-emerald-500",
    "bg-gradient-to-r from-orange-500 to-amber-500",
    "bg-gradient-to-r from-pink-500 to-rose-500",
    "bg-gradient-to-r from-indigo-500 to-blue-500",
];

interface HabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (habit: Partial<Habit>) => void;
    editingHabit?: Habit | null;
}

const HabitModal = memo(function HabitModal({ isOpen, onClose, onSave, editingHabit }: HabitModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [icon, setIcon] = useState("🎯");
    const [color, setColor] = useState(habitColors[0]);
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "custom">("daily");
    const [reminderTime, setReminderTime] = useState("");

    useEffect(() => {
        if (editingHabit) {
            setTitle(editingHabit.title);
            setDescription(editingHabit.description || "");
            setIcon(editingHabit.icon);
            setColor(editingHabit.color);
            setFrequency(editingHabit.frequency);
            setReminderTime(editingHabit.reminder_time || "");
        } else {
            setTitle("");
            setDescription("");
            setIcon("🎯");
            setColor(habitColors[0]);
            setFrequency("daily");
            setReminderTime("");
        }
    }, [editingHabit, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave({
            title: title.trim(),
            description: description.trim() || null,
            icon,
            color,
            frequency,
            reminder_time: reminderTime || null,
            target_days: frequency === "daily" ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5],
        });

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
                    <h2 className="text-xl font-bold text-foreground">
                        {editingHabit ? "Edit Habit" : "New Habit"}
                    </h2>
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
                            placeholder="e.g., Morning Meditation"
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
                            Icon
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {habitIcons.map((i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIcon(i)}
                                    className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${icon === i
                                            ? "bg-primary/20 ring-2 ring-primary"
                                            : "bg-background hover:bg-muted"
                                        }`}
                                >
                                    {i}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {habitColors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-10 h-10 rounded-lg ${c} transition-all ${color === c ? "ring-2 ring-white ring-offset-2 ring-offset-card" : ""
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Frequency
                        </label>
                        <div className="flex gap-2">
                            {(["daily", "weekly"] as const).map((f) => (
                                <button
                                    key={f}
                                    type="button"
                                    onClick={() => setFrequency(f)}
                                    className={`flex-1 py-2 px-4 rounded-lg capitalize transition-all ${frequency === f
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border border-border text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Reminder Time (optional)
                        </label>
                        <input
                            type="time"
                            value={reminderTime}
                            onChange={(e) => setReminderTime(e.target.value)}
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                        {editingHabit ? "Save Changes" : "Create Habit"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
});

interface HabitCardProps {
    habit: Habit;
    isCompletedToday: boolean;
    onToggle: (habit: Habit) => void;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
}

const HabitCard = memo(function HabitCard({ habit, isCompletedToday, onToggle, onEdit, onDelete }: HabitCardProps) {
    return (
        <motion.div
            layout
            variants={fadeUp}
            className={`relative p-4 rounded-2xl border transition-all ${isCompletedToday
                    ? "bg-primary/10 border-primary/30"
                    : "bg-card border-border hover:border-primary/30"
                }`}
        >
            <div className="flex items-center gap-4">
                {/* Completion button */}
                <button
                    onClick={() => onToggle(habit)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${isCompletedToday
                            ? `${habit.color} text-white shadow-lg`
                            : "bg-muted hover:bg-muted/80"
                        }`}
                >
                    {isCompletedToday ? <Check size={24} /> : habit.icon}
                </button>

                {/* Habit info */}
                <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-foreground ${isCompletedToday ? "line-through opacity-60" : ""}`}>
                        {habit.title}
                    </h3>
                    {habit.description && (
                        <p className="text-sm text-muted-foreground truncate">{habit.description}</p>
                    )}
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-500/10 rounded-lg">
                    <Flame size={16} className="text-orange-500" />
                    <span className="text-sm font-bold text-orange-500">{habit.current_streak}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(habit)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <Edit3 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(habit.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Best streak badge */}
            {habit.best_streak > 0 && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full">
                    <Trophy size={12} />
                    Best: {habit.best_streak}
                </div>
            )}
        </motion.div>
    );
});

// Heatmap Component
interface HeatmapProps {
    completions: HabitCompletion[];
}

const Heatmap = memo(function Heatmap({ completions }: HeatmapProps) {
    const dates = useMemo(() => {
        const result: { date: string; count: number }[] = [];
        const today = new Date();

        // Generate last 91 days (13 weeks)
        for (let i = 90; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = completions.filter(c => c.completed_date === dateStr).length;
            result.push({ date: dateStr, count });
        }

        return result;
    }, [completions]);

    const getIntensity = (count: number) => {
        if (count === 0) return "bg-muted";
        if (count === 1) return "bg-green-500/30";
        if (count === 2) return "bg-green-500/50";
        if (count === 3) return "bg-green-500/70";
        return "bg-green-500";
    };

    const weeks = useMemo(() => {
        const result: typeof dates[] = [];
        for (let i = 0; i < dates.length; i += 7) {
            result.push(dates.slice(i, i + 7));
        }
        return result;
    }, [dates]);

    return (
        <div className="p-4 bg-card border border-border rounded-2xl">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar size={16} />
                Activity
            </h3>
            <div className="flex gap-1 overflow-x-auto pb-2">
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day) => (
                            <div
                                key={day.date}
                                title={`${day.date}: ${day.count} habits`}
                                className={`w-3 h-3 rounded-sm ${getIntensity(day.count)} transition-colors hover:ring-2 hover:ring-primary`}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted" />
                    <div className="w-3 h-3 rounded-sm bg-green-500/30" />
                    <div className="w-3 h-3 rounded-sm bg-green-500/50" />
                    <div className="w-3 h-3 rounded-sm bg-green-500/70" />
                    <div className="w-3 h-3 rounded-sm bg-green-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
});

// Stats Component
interface StatsProps {
    habits: Habit[];
    completionsToday: number;
}

const Stats = memo(function Stats({ habits, completionsToday }: StatsProps) {
    const totalStreak = habits.reduce((sum, h) => sum + h.current_streak, 0);
    const totalCompletions = habits.reduce((sum, h) => sum + h.total_completions, 0);
    const completionRate = habits.length > 0 ? Math.round((completionsToday / habits.length) * 100) : 0;

    const stats = [
        { label: "Today", value: `${completionsToday}/${habits.length}`, icon: Target, color: "text-blue-500" },
        { label: "Total Streak", value: totalStreak, icon: Flame, color: "text-orange-500" },
        { label: "All Time", value: totalCompletions, icon: Star, color: "text-yellow-500" },
        { label: "Completion", value: `${completionRate}%`, icon: Zap, color: "text-green-500" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat) => (
                <div key={stat.label} className="p-4 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        <stat.icon size={16} className={stat.color} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
            ))}
        </div>
    );
});

export default function HabitsTracker() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completions, setCompletions] = useState<HabitCompletion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

    const today = new Date().toISOString().split('T')[0];

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [habitsData, completionsData] = await Promise.all([
            getHabits(),
            getHabitCompletions(undefined, new Date(Date.now() - 91 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        ]);
        setHabits(habitsData);
        setCompletions(completionsData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const todaysCompletions = useMemo(() => {
        return completions.filter(c => c.completed_date === today);
    }, [completions, today]);

    const isHabitCompletedToday = useCallback((habitId: string) => {
        return todaysCompletions.some(c => c.habit_id === habitId);
    }, [todaysCompletions]);

    const handleSaveHabit = async (data: Partial<Habit>) => {
        if (editingHabit) {
            const updated = await updateHabit(editingHabit.id, data);
            if (updated) {
                setHabits(prev => prev.map(h => h.id === updated.id ? updated : h));
            }
        } else {
            const created = await createHabit(data);
            if (created) {
                setHabits(prev => [...prev, created]);
            }
        }
        setEditingHabit(null);
    };

    const handleToggleHabit = async (habit: Habit) => {
        const isCompleted = isHabitCompletedToday(habit.id);

        if (isCompleted) {
            await uncompleteHabit(habit.id, today);
            setCompletions(prev => prev.filter(c => !(c.habit_id === habit.id && c.completed_date === today)));
        } else {
            const completion = await completeHabit(habit.id);
            if (completion) {
                setCompletions(prev => [...prev, completion]);
            }
        }

        // Refresh habits for streak update
        const updatedHabits = await getHabits();
        setHabits(updatedHabits);
    };

    const handleDeleteHabit = async (id: string) => {
        if (confirm("Are you sure you want to delete this habit?")) {
            await deleteHabit(id);
            setHabits(prev => prev.filter(h => h.id !== id));
        }
    };

    const handleEditHabit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Habits</h1>
                    <p className="text-muted-foreground">Build consistency, one day at a time</p>
                </div>
                <button
                    onClick={() => {
                        setEditingHabit(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    <span className="hidden sm:inline">New Habit</span>
                </button>
            </div>

            {/* Stats */}
            <Stats habits={habits} completionsToday={todaysCompletions.length} />

            {/* Heatmap */}
            <Heatmap completions={completions} />

            {/* Habits List */}
            <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock size={20} />
                    Today&apos;s Habits
                </h2>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                ) : habits.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12 px-4 bg-card border border-border rounded-2xl"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <Target size={32} className="text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first habit to start building streaks!</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                        >
                            Create Habit
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="space-y-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    isCompletedToday={isHabitCompletedToday(habit.id)}
                                    onToggle={handleToggleHabit}
                                    onEdit={handleEditHabit}
                                    onDelete={handleDeleteHabit}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <HabitModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingHabit(null);
                        }}
                        onSave={handleSaveHabit}
                        editingHabit={editingHabit}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
