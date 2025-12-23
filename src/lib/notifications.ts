"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAuth } from "./auth-context";
import { getUpcomingTimeBlocks, createNotification, getUpcomingIdeaDeadlines } from "./supabase-service";
import { TimeBlock } from "./database.types";

import { registerPushSubscription } from "./push-service";

// Request browser notification permission
export async function requestNotificationPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return false;
    }

    if (Notification.permission === "granted") {
        // Ensure push subscription is active
        registerPushSubscription().catch(e => console.error("Push registration error:", e));
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            // Register for push notifications
            registerPushSubscription().catch(e => console.error("Push registration error:", e));
            return true;
        }
    }

    return false;
}

// Show browser notification
export function showBrowserNotification(
    title: string,
    options?: NotificationOptions
): void {
    if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            icon: "/favicon-96x96.png",
            badge: "/favicon-96x96.png",
            tag: "hustly-notification",
            ...options,
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };

        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
    }
}

// Play notification sound using Web Audio API (no external file needed)
export function playNotificationSound(): void {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Nice "ding" sound (C5 to C6 chirp)
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.1);

        // Sustain and fade out
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
        console.error("Error playing notification sound:", error);
    }
}

// Test notification
export function testNotification() {
    playNotificationSound();
    showBrowserNotification("🔔 Test Notification", {
        body: "This is a test notification from Hustly! Sounds good? 🎵",
        requireInteraction: false
    });
}

// Check for upcoming time blocks and send notifications
async function checkTimeBlockReminders(
    sentReminders: Set<string>
): Promise<void> {
    const upcomingBlocks = await getUpcomingTimeBlocks(10);
    const now = new Date();

    for (const block of upcomingBlocks) {
        const startTime = new Date(block.start_time);
        const reminderTime = new Date(
            startTime.getTime() - block.reminder_minutes * 60 * 1000
        );

        // Check if reminder should be sent now (within 1 minute window)
        const timeDiff = now.getTime() - reminderTime.getTime();
        if (timeDiff >= 0 && timeDiff < 60000) {
            const reminderId = `${block.id}-${block.reminder_minutes}`;
            if (!sentReminders.has(reminderId)) {
                sentReminders.add(reminderId);

                // Show browser notification
                showBrowserNotification(`⏰ ${block.title}`, {
                    body: `Starting in ${block.reminder_minutes} minutes`,
                    tag: `time-block-${block.id}`,
                    requireInteraction: true,
                });

                // Play sound
                playNotificationSound();
            }
        }

        // Check if block is starting now (within 1 minute window)
        const startDiff = now.getTime() - startTime.getTime();
        if (startDiff >= 0 && startDiff < 60000) {
            const startId = `${block.id}-start`;
            if (!sentReminders.has(startId)) {
                sentReminders.add(startId);

                showBrowserNotification(`🎯 Time to start: ${block.title}`, {
                    body: `Your time block is starting now!`,
                    tag: `time-block-start-${block.id}`,
                    requireInteraction: true,
                });

                playNotificationSound();
            }
        }
    }
}

// Check for idea deadlines
async function checkIdeaDeadlines(sentReminders: Set<string>): Promise<void> {
    const ideas = await getUpcomingIdeaDeadlines(24); // Get ideas due in next 24h
    const now = new Date();

    for (const idea of ideas) {
        if (!idea.due_date) continue;
        const due = new Date(idea.due_date);
        const timeDiff = due.getTime() - now.getTime();
        const hoursLeft = timeDiff / (1000 * 60 * 60);

        // Notify if due in < 1 hour (and not notified)
        if (hoursLeft <= 1 && hoursLeft > 0) {
            const reminderId = `idea-${idea.id}-1h`;
            if (!sentReminders.has(reminderId)) {
                sentReminders.add(reminderId);
                showBrowserNotification(`⏳ Deadline Soon: ${idea.title}`, {
                    body: `Task is due in less than 1 hour!`,
                    tag: `idea-1h-${idea.id}`,
                    requireInteraction: true
                });
                playNotificationSound();
            }
        }
        // Notify if due in < 24 hours (and not notified)
        else if (hoursLeft <= 24 && hoursLeft > 23) {
            const reminderId = `idea-${idea.id}-24h`;
            if (!sentReminders.has(reminderId)) {
                sentReminders.add(reminderId);
                showBrowserNotification(`📅 Deadline Tomorrow: ${idea.title}`, {
                    body: `Don't forget this task is due tomorrow.`,
                    tag: `idea-24h-${idea.id}`,
                    requireInteraction: false
                });
            }
        }
    }
}

// Hook for time block notifications
export function useTimeBlockNotifications() {
    const { user } = useAuth();
    const sentRemindersRef = useRef<Set<string>>(new Set());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startChecking = useCallback(async () => {
        // Request permission first
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) return;

        // Check immediately
        await checkTimeBlockReminders(sentRemindersRef.current);
        await checkIdeaDeadlines(sentRemindersRef.current);

        // Check every 30 seconds
        intervalRef.current = setInterval(async () => {
            await checkTimeBlockReminders(sentRemindersRef.current);
            await checkIdeaDeadlines(sentRemindersRef.current);
        }, 30000);
    }, []);

    const stopChecking = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (user) {
            startChecking();
        }

        return () => {
            stopChecking();
        };
    }, [user, startChecking, stopChecking]);

    return {
        requestPermission: requestNotificationPermission,
        showNotification: showBrowserNotification,
    };
}

// Hook for general app notifications
export function useAppNotifications() {
    const { user } = useAuth();

    // Request permission on mount
    useEffect(() => {
        if (user) {
            requestNotificationPermission();
        }
    }, [user]);

    const notify = useCallback(
        (title: string, message: string, options?: NotificationOptions) => {
            showBrowserNotification(title, {
                body: message,
                ...options,
            });
        },
        []
    );

    return { notify };
}

// Notification types for the app
export interface AppNotification {
    id: string;
    type: "time_block" | "achievement" | "reminder" | "deadline" | "system";
    title: string;
    message: string;
    timestamp: Date;
    isRead: boolean;
    data?: Record<string, unknown>;
}

// Create in-app notification with optional browser push
export async function createAppNotification(
    type: AppNotification["type"],
    title: string,
    message: string,
    data?: Record<string, unknown>,
    showPush = true
): Promise<void> {
    // Create in database
    await createNotification({
        type: type === "time_block" ? "reminder" : type,
        title,
        message,
        data: data as Record<string, never>,
    });

    // Show browser notification if enabled
    if (showPush) {
        const hasPermission = await requestNotificationPermission();
        if (hasPermission) {
            showBrowserNotification(title, {
                body: message,
                tag: `${type} -${Date.now()} `,
            });
        }
    }
}
