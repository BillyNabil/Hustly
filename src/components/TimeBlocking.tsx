"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    Plus,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Trash2,
    Edit2,
    Calendar,
    Bell,
    BellOff,
    Play,
    Pause,
    AlertCircle,
    Timer,
    Coffee,
    Briefcase,
    Users,
    Target,
    MoreHorizontal,
    Sparkles,
    LayoutGrid,
    List,
} from "lucide-react";
import { TimeBlock, TimeBlockCategory } from "@/lib/database.types";
import {
    getTimeBlocks,
    createTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    completeTimeBlock,
    uncompleteTimeBlock,
    TIME_BLOCK_CATEGORIES,
    getCurrentTimeBlock,
} from "@/lib/supabase-service";
import { fadeUp, staggerContainer, scaleIn } from "@/lib/animations";

// Category icons mapping
const categoryIcons: Record<TimeBlockCategory, typeof Briefcase> = {
    work: Briefcase,
    personal: Coffee,
    meeting: Users,
    break: Coffee,
    focus: Target,
    other: MoreHorizontal,
};

// Time formatting helpers
function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function getDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getFullDayName(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Time block item component
interface TimeBlockItemProps {
    block: TimeBlock;
    onComplete: (id: string) => void;
    onUncomplete: (id: string) => void;
    onEdit: (block: TimeBlock) => void;
    onDelete: (id: string) => void;
    isCurrentBlock: boolean;
}

const TimeBlockItem = memo(function TimeBlockItem({
    block,
    onComplete,
    onUncomplete,
    onEdit,
    onDelete,
    isCurrentBlock,
}: TimeBlockItemProps) {
    const startTime = new Date(block.start_time);
    const endTime = new Date(block.end_time);
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    const category = TIME_BLOCK_CATEGORIES[block.category as TimeBlockCategory] || TIME_BLOCK_CATEGORIES.other;
    const CategoryIcon = categoryIcons[block.category as TimeBlockCategory] || MoreHorizontal;

    const isPast = endTime < new Date() && !block.is_completed;

    return (
        <motion.div
            layout
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="group relative pl-8 pb-4 last:pb-0"
        >
            {/* Timeline Connector */}
            <div className="absolute left-[11px] top-8 bottom-0 w-[2px] bg-[#333] group-last:hidden" />

            {/* Timeline Node */}
            <div
                onClick={() => block.is_completed ? onUncomplete(block.id) : onComplete(block.id)}
                className={`absolute left-0 top-6 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-black cursor-pointer transition-all duration-300 ${isCurrentBlock
                    ? "border-primary shadow-[0_0_15px_rgba(234,179,8,0.5)] scale-110"
                    : block.is_completed
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
            >
                {block.is_completed && <Check size={12} className="text-green-500" />}
                {isCurrentBlock && !block.is_completed && <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />}
            </div>

            <div className={`relative p-5 rounded-2xl border transition-all duration-300 group-hover:translate-x-1 ${block.is_completed
                ? "bg-black/20 border-white/5 opacity-50 grayscale-[0.5]"
                : isCurrentBlock
                    ? "bg-[#0A0A0A] border-primary/30 shadow-[0_0_30px_-10px_rgba(234,179,8,0.15)]"
                    : isPast
                        ? "bg-red-950/10 border-red-900/20"
                        : "bg-[#0A0A0A] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                }`}>

                {/* Current Highlight Gradient */}
                {isCurrentBlock && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl pointer-events-none" />
                )}

                <div className="flex items-start gap-4 relative z-10">
                    {/* Time & Duration Column */}
                    <div className="flex flex-col items-center justify-center min-w-[60px] text-center border-r border-white/5 pr-4 py-1">
                        <span className={`font-mono text-xs font-bold ${isCurrentBlock ? "text-primary" : "text-zinc-400"}`}>
                            {formatTime(startTime)}
                        </span>
                        <div className="h-4 w-[1px] bg-white/5 my-1" />
                        <span className="font-mono text-[10px] text-zinc-600">
                            {formatTime(endTime)}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            {isCurrentBlock && (
                                <span className="px-1.5 py-0.5 bg-primary/20 text-primary border border-primary/20 text-[9px] font-bold rounded uppercase tracking-wider animate-pulse">
                                    Current
                                </span>
                            )}

                            {isPast && !block.is_completed && (
                                <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-bold rounded uppercase tracking-wider">
                                    Missed
                                </span>
                            )}

                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/5 bg-white/5 text-zinc-400 flex items-center gap-1.5">
                                <CategoryIcon size={10} style={{ color: category.color }} />
                                <span className="uppercase tracking-wide">{category.label}</span>
                            </span>
                        </div>

                        <h4 className={`text-base font-bold mb-1 leading-tight ${block.is_completed ? "text-zinc-500 line-through" : "text-zinc-100"
                            }`}>
                            {block.title}
                        </h4>

                        {block.description && (
                            <p className="text-xs text-zinc-500 line-clamp-1 font-light">
                                {block.description}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-600 font-mono">
                            <span className="flex items-center gap-1">
                                <Timer size={10} />
                                {formatDuration(duration)}
                            </span>

                            {block.reminder_minutes > 0 && (
                                <span className="flex items-center gap-1 text-blue-400/70">
                                    <Bell size={10} />
                                    {block.reminder_minutes}m
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions - Hover only */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2">
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onEdit(block); }}
                            className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                            aria-label="Edit block"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            aria-label="Delete block"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

// Time block form modal
interface TimeBlockFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (block: Partial<TimeBlock>) => void;
    editingBlock?: TimeBlock | null;
    selectedDate: Date;
}

const TimeBlockForm = memo(function TimeBlockForm({
    isOpen,
    onClose,
    onSave,
    editingBlock,
    selectedDate,
}: TimeBlockFormProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("10:00");
    const [category, setCategory] = useState<TimeBlockCategory>("work");
    const [reminderMinutes, setReminderMinutes] = useState(15);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingBlock) {
            setTitle(editingBlock.title);
            setDescription(editingBlock.description || "");
            const start = new Date(editingBlock.start_time);
            const end = new Date(editingBlock.end_time);
            setStartTime(formatTime(start));
            setEndTime(formatTime(end));
            setCategory(editingBlock.category as TimeBlockCategory);
            setReminderMinutes(editingBlock.reminder_minutes);
        } else {
            // Reset form
            setTitle("");
            setDescription("");
            setStartTime("09:00");
            setEndTime("10:00");
            setCategory("work");
            setReminderMinutes(15);
        }
    }, [editingBlock, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsSubmitting(true);

        // Parse times and combine with selected date
        const [startHours, startMins] = startTime.split(":").map(Number);
        const [endHours, endMins] = endTime.split(":").map(Number);

        const startDateTime = new Date(selectedDate);
        startDateTime.setHours(startHours, startMins, 0, 0);

        const endDateTime = new Date(selectedDate);
        endDateTime.setHours(endHours, endMins, 0, 0);

        // Handle overnight blocks
        if (endDateTime <= startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }

        await onSave({
            title: title.trim(),
            description: description.trim() || null,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            category,
            reminder_minutes: reminderMinutes,
            color: TIME_BLOCK_CATEGORIES[category].color,
        });

        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            {editingBlock ? <Edit2 size={16} className="text-primary" /> : <Clock size={16} className="text-primary" />}
                            {editingBlock ? "EDIT BLOCK" : "NEW BLOCK"}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                            aria-label="Close form"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</label>
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Meeting with team..."
                                className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Start</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-mono"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">End</label>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(Object.entries(TIME_BLOCK_CATEGORIES) as [TimeBlockCategory, typeof TIME_BLOCK_CATEGORIES.work][]).map(([key, value]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setCategory(key)}
                                        className={`px-2 py-2.5 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all border ${category === key ? "bg-white/10 border-white/20 text-white" : "bg-[#1A1A1A] border-white/5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                            }`}
                                    >
                                        <span style={{ color: category === key ? value.color : 'inherit' }}>{value.icon}</span>
                                        {value.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-0 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-[#1A1A1A] text-zinc-400 rounded-xl font-bold hover:text-white hover:bg-white/5 transition-colors text-sm"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim()}
                            className="flex-1 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
                        >
                            {isSubmitting ? "SAVING..." : editingBlock ? "SAVE CHANGES" : "CREATE BLOCK"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
});

// Main TimeBlocking component
export default function TimeBlocking() {
    const [blocks, setBlocks] = useState<TimeBlock[]>([]);
    const [currentBlock, setCurrentBlock] = useState<TimeBlock | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);

    // Fetch blocks for selected date
    const fetchBlocks = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        try {
            const dateStr = selectedDate.toISOString().split("T")[0];
            const [data, current] = await Promise.race([
                Promise.all([
                    getTimeBlocks(dateStr),
                    getCurrentTimeBlock()
                ]),
                timeoutPromise
            ]) as [TimeBlock[], TimeBlock | null];
            setBlocks(data);
            setCurrentBlock(current);
        } catch (err) {
            console.error('Error fetching time blocks:', err);
            // Don't show error for timeout - just show empty state
            if (err instanceof Error && err.message === 'Request timeout') {
                console.warn('Time blocks fetch timed out');
            } else {
                setError('Failed to load schedule');
            }
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchBlocks();
        const interval = setInterval(async () => {
            setCurrentBlock(await getCurrentTimeBlock());
        }, 60000);
        return () => clearInterval(interval);
    }, [fetchBlocks]);

    // Navigation handlers
    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
    };

    // CRUD handlers
    const handleSave = async (blockData: Partial<TimeBlock>) => {
        if (editingBlock) {
            const updated = await updateTimeBlock(editingBlock.id, blockData);
            if (updated) setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b));
        } else {
            const created = await createTimeBlock(blockData);
            if (created) setBlocks(prev => [...prev, created].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()));
        }
        setEditingBlock(null);
    };

    const handleComplete = async (id: string) => {
        const completed = await completeTimeBlock(id);
        if (completed) setBlocks(prev => prev.map(b => b.id === completed.id ? completed : b));
    };

    const handleUncomplete = async (id: string) => {
        const uncompleted = await uncompleteTimeBlock(id);
        if (uncompleted) setBlocks(prev => prev.map(b => b.id === uncompleted.id ? uncompleted : b));
    };

    const handleDelete = async (id: string) => {
        if (await deleteTimeBlock(id)) setBlocks(prev => prev.filter(b => b.id !== id));
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();

    // Handlers for edit/close
    const handleEdit = (block: TimeBlock) => {
        setEditingBlock(block);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingBlock(null);
    };

    // Stats calculation
    const dayStats = useMemo(() => {
        let totalMinutes = 0;
        let completedMinutes = 0;
        blocks.forEach((block) => {
            const duration = (new Date(block.end_time).getTime() - new Date(block.start_time).getTime()) / 60000;
            totalMinutes += duration;
            if (block.is_completed) completedMinutes += duration;
        });
        return { totalBlocks: blocks.length, completedBlocks: blocks.filter(b => b.is_completed).length, totalMinutes, completedMinutes };
    }, [blocks]);

    return (
        <div className="h-full flex flex-col max-w-[1600px] mx-auto w-full">
            {/* Header */}
            <div className="flex-shrink-0 p-1 md:mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Time Blocking</h1>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-wide">Plan your daily focus</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { setEditingBlock(null); setIsFormOpen(true); }}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)] hover:shadow-[0_0_25px_-5px_rgba(234,179,8,0.5)] active:scale-95 text-sm"
                    >
                        <Plus size={18} />
                        <span>Add Block</span>
                    </button>
                </div>

                {/* Controls Bar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-1 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div className="flex items-center justify-between w-full lg:w-auto gap-2 p-1">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Previous day"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedDate(new Date())}
                                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${isToday ? "bg-primary text-black" : "text-white hover:bg-white/10"}`}
                            >
                                Today
                            </button>
                            <span className="text-xs font-mono text-zinc-600 px-2 border-l border-white/10 whitespace-nowrap">
                                {formatDate(selectedDate)}
                            </span>
                        </div>
                        <button
                            onClick={() => changeDate(1)}
                            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Next day"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="flex items-center justify-center w-full lg:w-auto gap-4 px-4 py-2 border-t lg:border-t-0 border-white/5 mx-auto">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                            <div className="w-2 h-2 rounded-full bg-primary/50" />
                            <span className="text-white font-bold">{dayStats.totalBlocks}</span> blocks
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                            <Timer size={12} className="text-primary/50" />
                            <span className="text-white font-bold">{Math.round(dayStats.totalMinutes / 60)}h</span> planned
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-xs font-mono uppercase tracking-widest">Loading Schedule...</p>
                    </div>
                ) : blocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 opacity-50">
                            <Calendar size={32} className="text-zinc-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No blocks planned</h3>
                        <p className="text-sm text-zinc-500 max-w-xs text-center mb-6">
                            "The key is not to prioritize what's on your schedule, but to schedule your priorities."
                        </p>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-mono text-xs uppercase tracking-wider"
                        >
                            Create First Block
                        </button>
                    </div>
                ) : (
                    <div className="relative py-4 space-y-2">
                        {/* Current Block Highlight (Mobile/List view) */}
                        {currentBlock && isToday && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-0.5 rounded-2xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 animate-pulse"
                            >
                                <div className="bg-black rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <Clock size={100} className="text-primary translate-x-1/3 -translate-y-1/3" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="inline-block px-2 py-1 rounded bg-primary text-black text-[10px] font-bold uppercase tracking-wider mb-2">
                                            Now Active
                                        </span>
                                        <h2 className="text-2xl font-bold text-white mb-1">{currentBlock.title}</h2>
                                        <p className="text-primary font-mono text-sm mb-4">
                                            Ends at {formatTime(new Date(currentBlock.end_time))}
                                        </p>
                                        <button
                                            onClick={() => handleComplete(currentBlock.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Check size={14} /> Mark Complete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="popLayout">
                            {blocks.map((block) => (
                                <TimeBlockItem
                                    key={block.id}
                                    block={block}
                                    onComplete={handleComplete}
                                    onUncomplete={handleUncomplete}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    isCurrentBlock={currentBlock?.id === block.id}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <TimeBlockForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSave={handleSave}
                editingBlock={editingBlock}
                selectedDate={selectedDate}
            />
        </div>
    );
}
