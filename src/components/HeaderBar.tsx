"use client";

import { useState, useEffect, memo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, CheckCheck, X, Settings, Sunrise } from "lucide-react";
import Link from "next/link";
import { Notification } from "@/lib/database.types";
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "@/lib/supabase-service";
import { cn } from "@/lib/utils";

// Notification Item Component
const NotificationItem = memo(function NotificationItem({
    notification,
    onMarkAsRead,
}: {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
}) {
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
        <div
            className={cn(
                "p-3 rounded-xl border transition-all cursor-pointer hover:bg-primary/5",
                notification.is_read
                    ? "bg-card/30 border-transparent"
                    : "bg-card border-primary/20"
            )}
            onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
        >
            <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <h4 className={cn(
                            "font-medium text-sm truncate",
                            notification.is_read ? "text-muted-foreground" : "text-foreground"
                        )}>
                            {notification.title}
                        </h4>
                        {!notification.is_read && (
                            <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {timeAgo(notification.created_at)}
                    </p>
                </div>
            </div>
        </div>
    );
});

function HeaderBar() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    const fetchNotifications = useCallback(async () => {
        const [notifs, count] = await Promise.all([
            getNotifications(),
            getUnreadNotificationCount(),
        ]);
        setNotifications(notifs.slice(0, 5)); // Only show latest 5
        setUnreadCount(count);
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleMarkAsRead = async (id: string) => {
        await markNotificationAsRead(id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const toggleDropdown = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    // Check if running in Tauri (desktop)
    const [isTauri, setIsTauri] = useState(false);

    useEffect(() => {
        // Detect Tauri environment
        import("@tauri-apps/api/window").then(() => {
            setIsTauri(true);
        }).catch(() => {
            setIsTauri(false);
        });
    }, []);

    return (
        <div className={cn(
            "fixed right-3 md:right-4 z-50",
            isTauri ? "bottom-20" : "bottom-20 md:bottom-4"
        )} ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={toggleDropdown}
                className={cn(
                    "relative p-2.5 rounded-xl border backdrop-blur-xl shadow-lg transition-all",
                    isOpen
                        ? "bg-card border-primary/30 text-primary"
                        : "bg-card/80 border-primary/10 text-muted-foreground hover:text-primary hover:border-primary/30"
                )}
            >
                {unreadCount > 0 ? (
                    <BellRing size={20} className="animate-pulse" />
                ) : (
                    <Bell size={20} />
                )}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 bottom-full mb-2 w-80 md:w-96 bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-primary/10 flex items-center justify-between">
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
                                        onClick={handleMarkAllAsRead}
                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-[50vh] overflow-y-auto p-2 space-y-1">
                            {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                    <Bell size={32} className="mx-auto text-muted-foreground/50 mb-2" />
                                    <p className="text-muted-foreground text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                    />
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-2 border-t border-primary/10">
                            <Link
                                href="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="block w-full p-2.5 text-center text-sm font-medium text-primary hover:bg-primary/10 rounded-xl transition-colors"
                            >
                                View All Notifications
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default memo(HeaderBar);
