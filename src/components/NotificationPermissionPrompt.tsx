"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { requestNotificationPermission } from "@/lib/notifications";

export function NotificationPermissionPrompt() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if permission is default (not asked yet)
        if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "default") {
                // Check if user already dismissed it recently
                const dismissed = localStorage.getItem("notification-prompt-dismissed");
                // Reset dismissal after 3 days (optional strategy, but for now simple check)

                if (!dismissed) {
                    // Small delay to not overwhelm on load
                    const timer = setTimeout(() => setIsVisible(true), 3000);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, []);

    const handleAllow = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // Save dismissal with timestamp? For now just simple flag.
        localStorage.setItem("notification-prompt-dismissed", "true");
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[350px] p-4 bg-background/95 backdrop-blur-md border border-primary/20 rounded-2xl shadow-2xl z-[100] flex flex-col gap-3"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Bell className="w-4 h-4 text-primary fill-primary/20" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm text-foreground">Enable Notifications</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Stay on track with your hustle</p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed pl-[44px]">
                        Get real-time reminders for your time blocks, habits, and daily goals. Works even when the app is in the background.
                    </p>

                    <div className="flex gap-2 justify-end mt-1">
                        <button
                            onClick={handleDismiss}
                            className="text-xs px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={handleAllow}
                            className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            Turn On Notifications
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
