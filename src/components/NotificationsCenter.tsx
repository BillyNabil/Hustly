"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    BellRing,
    Check,
    CheckCheck,
    Trophy,
    Clock,
    Target,
    Sunrise,
    AlertCircle,
    Zap,
    X,
    Inbox,
    Sparkles,
} from "lucide-react";
import { Notification } from "@/lib/database.types";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    generateMorningBriefing,
} from "@/lib/supabase-service";

const notificationIcons: Record<string, typeof Bell> = {
    reminder: Clock,
    achievement: Trophy,
    deadline: AlertCircle,
    briefing: Sunrise,
    challenge: Target,
    system: Zap,
};

const notificationAccents: Record<string, { bg: string; text: string; border: string }> = {
    reminder: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
    achievement: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    deadline: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
    briefing: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
    challenge: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
    system: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
};

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    index: number;
}

const NotificationItem = memo(function NotificationItem({ notification, onMarkAsRead, index }: NotificationItemProps) {
    const Icon = notificationIcons[notification.type] || Zap;
    const accent = notificationAccents[notification.type] || notificationAccents.system;

    const timeAgo = (date: string) => {
        const now = new Date();
        const then = new Date(date);
        const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
        return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
            layout
            className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 ${notification.is_read
                    ? "bg-card/30 border-white/5 hover:border-white/10"
                    : `${accent.bg} ${accent.border} hover:shadow-lg`
                }`}
        >
            {/* Animated gradient overlay for unread */}
            {!notification.is_read && (
                <motion.div
                    className={`absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent`}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                />
            )}

            <div className="relative p-4 flex items-start gap-4">
                {/* Icon with pulse effect */}
                <div className="relative flex-shrink-0">
                    <div className={`p-2.5 rounded-xl ${accent.bg} ${accent.border} border`}>
                        <Icon size={18} className={accent.text} />
                    </div>
                    {!notification.is_read && (
                        <motion.div
                            className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${accent.text.replace('text-', 'bg-')}`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className={`font-semibold text-sm truncate ${notification.is_read ? "text-muted-foreground" : "text-foreground"
                            }`}>
                            {notification.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider flex-shrink-0">
                            {timeAgo(notification.created_at)}
                        </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${notification.is_read ? "text-muted-foreground/50" : "text-muted-foreground"
                        }`}>
                        {notification.message}
                    </p>
                </div>

                {/* Mark as read button */}
                {!notification.is_read && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onMarkAsRead(notification.id)}
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${accent.bg} hover:bg-white/10`}
                        title="Mark as read"
                    >
                        <Check size={14} className={accent.text} />
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
});

// Visual Header Component with animated graphics
const NotificationHeader = memo(function NotificationHeader({
    unreadCount,
    onMarkAllAsRead,
    onGenerateBriefing,
}: {
    unreadCount: number;
    onMarkAllAsRead: () => void;
    onGenerateBriefing: () => void;
}) {
    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-card via-card to-card/50 mb-8">
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 3) * 20}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Gradient orb */}
            <motion.div
                className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Title Section */}
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="relative"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                                <Bell size={28} className="text-primary" />
                            </div>
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                                >
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </motion.span>
                            )}
                        </motion.div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                                Inbox
                            </h1>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                {unreadCount > 0 ? (
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles size={12} className="text-primary" />
                                        {unreadCount} new update{unreadCount > 1 ? "s" : ""} waiting
                                    </span>
                                ) : (
                                    "You're all caught up"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onGenerateBriefing}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium text-sm hover:bg-orange-500/20 transition-colors"
                        >
                            <Sunrise size={16} />
                            <span className="hidden sm:inline">Daily Brief</span>
                        </motion.button>
                        {unreadCount > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onMarkAllAsRead}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 font-medium text-sm hover:bg-primary/20 transition-colors"
                            >
                                <CheckCheck size={16} />
                                <span className="hidden sm:inline">Clear All</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

// Empty State Component
const EmptyState = memo(function EmptyState({ filter }: { filter: "all" | "unread" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-card to-card/30 p-12 text-center"
        >
            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="w-48 h-48 border border-primary/10 rounded-full"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute w-48 h-48 border border-primary/10 rounded-full"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
            </div>

            <div className="relative z-10">
                <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <Inbox size={36} className="text-primary/60" />
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    {filter === "unread" ? "All Clear" : "No Activity Yet"}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                    {filter === "unread"
                        ? "Nice work! You've handled everything."
                        : "Start using the app and updates will appear here."}
                </p>
            </div>
        </motion.div>
    );
});

// Full page notification center
export default function NotificationsCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        const data = await getNotifications(filter === "unread");
        setNotifications(data);
        setIsLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
    };

    const handleMarkAllAsRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleGenerateBriefing = async () => {
        await generateMorningBriefing();
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header with Visual */}
            <NotificationHeader
                unreadCount={unreadCount}
                onMarkAllAsRead={handleMarkAllAsRead}
                onGenerateBriefing={handleGenerateBriefing}
            />

            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 bg-muted/30 rounded-xl mb-6 w-fit">
                {(["all", "unread"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === tab
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab === "all" ? "All" : "Unread"}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <motion.div
                        className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            ) : notifications.length === 0 ? (
                <EmptyState filter={filter} />
            ) : (
                <motion.div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {notifications.map((notification, index) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                index={index}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}

// Hook for using notifications
export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [notifs, count] = await Promise.all([
                getNotifications(),
                getUnreadNotificationCount(),
            ]);
            setNotifications(notifs);
            setUnreadCount(count);
        };
        fetchData();

        // Poll for new notifications every minute
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    return {
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        markAsRead,
        markAllAsRead,
    };
}
