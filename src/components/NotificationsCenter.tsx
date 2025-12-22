"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    BellRing,
    Check,
    CheckCheck,
    Trophy,
    Calendar,
    Target,
    Sunrise,
    AlertCircle,
    Zap,
    X,
    Clock,
    Trash2,
} from "lucide-react";
import { Notification } from "@/lib/database.types";
import { transitions, fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
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
    system: Bell,
};

const notificationColors: Record<string, string> = {
    reminder: "bg-blue-500",
    achievement: "bg-amber-500",
    deadline: "bg-red-500",
    briefing: "bg-orange-500",
    challenge: "bg-purple-500",
    system: "bg-slate-500",
};

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}

const NotificationItem = memo(function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const Icon = notificationIcons[notification.type] || Bell;
    const bgColor = notificationColors[notification.type] || notificationColors.system;

    const timeAgo = (date: string) => {
        const now = new Date();
        const then = new Date(date);
        const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return then.toLocaleDateString();
    };

    return (
        <motion.div
            layout
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`p-4 rounded-xl border transition-all ${notification.is_read
                    ? "bg-card/50 border-border"
                    : "bg-card border-primary/30 shadow-sm"
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2.5 rounded-xl ${bgColor}`}>
                    <Icon size={18} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm ${notification.is_read ? "text-muted-foreground" : "text-foreground"
                            }`}>
                            {notification.title}
                        </h4>
                        {!notification.is_read && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                    </div>
                    <p className={`text-sm whitespace-pre-line ${notification.is_read ? "text-muted-foreground/70" : "text-muted-foreground"
                        }`}>
                        {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        {timeAgo(notification.created_at)}
                    </p>
                </div>

                {/* Mark as read button */}
                {!notification.is_read && (
                    <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Mark as read"
                    >
                        <Check size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
});

interface NotificationBellProps {
    count: number;
    onClick: () => void;
}

export const NotificationBell = memo(function NotificationBell({ count, onClick }: NotificationBellProps) {
    return (
        <button
            onClick={onClick}
            className="relative p-2.5 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
        >
            {count > 0 ? (
                <BellRing size={20} className="text-foreground animate-pulse" />
            ) : (
                <Bell size={20} className="text-muted-foreground" />
            )}
            {count > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                    {count > 9 ? "9+" : count}
                </motion.span>
            )}
        </button>
    );
});

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export const NotificationDropdown = memo(function NotificationDropdown({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
}: NotificationDropdownProps) {
    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Dropdown */}
            <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 md:w-96 max-h-[70vh] overflow-hidden bg-card border border-border rounded-2xl shadow-2xl z-50"
            >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell size={18} className="text-primary" />
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                onClick={onMarkAllAsRead}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                title="Mark all as read"
                            >
                                <CheckCheck size={16} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Notifications list */}
                <div className="max-h-[50vh] overflow-y-auto p-3 space-y-2">
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8"
                            >
                                <Bell size={32} className="mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground text-sm">No notifications yet</p>
                            </motion.div>
                        ) : (
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={onMarkAsRead}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Bell className="text-primary" />
                        Notifications
                    </h1>
                    <p className="text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleGenerateBriefing}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-500 rounded-xl font-medium hover:bg-orange-500/20 transition-colors"
                    >
                        <Sunrise size={18} />
                        <span className="hidden sm:inline">Morning Briefing</span>
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors"
                        >
                            <CheckCheck size={18} />
                            <span className="hidden sm:inline">Mark all read</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "unread"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Unread
                </button>
            </div>

            {/* Notifications List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                >
                    <AnimatePresence mode="popLayout">
                        {notifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12 px-4 bg-card border border-border rounded-2xl"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Bell size={32} className="text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                                </h3>
                                <p className="text-muted-foreground">
                                    {filter === "unread"
                                        ? "You're all caught up!"
                                        : "Notifications will appear here as you use the app."}
                                </p>
                            </motion.div>
                        ) : (
                            notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={handleMarkAsRead}
                                />
                            ))
                        )}
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
