"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Check } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered:', registration.scope);
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        }

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Listen for install prompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        // Listen for successful install
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return false;

        try {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;

            if (outcome === 'accepted') {
                setIsInstalled(true);
                setIsInstallable(false);
            }

            setDeferredPrompt(null);
            return outcome === 'accepted';
        } catch (error) {
            console.error('[PWA] Install error:', error);
            return false;
        }
    };

    return {
        isInstallable,
        isInstalled,
        installApp,
    };
}

export function useNotificationPermission() {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            return 'denied';
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    return {
        permission,
        requestPermission,
    };
}

interface PWAInstallPromptProps {
    onDismiss?: () => void;
}

export function PWAInstallPrompt({ onDismiss }: PWAInstallPromptProps) {
    const { isInstallable, isInstalled, installApp } = usePWA();
    const [dismissed, setDismissed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        // Check if user dismissed before
        const wasDismissed = localStorage.getItem('pwa-install-dismissed');
        if (wasDismissed) {
            const dismissedTime = parseInt(wasDismissed, 10);
            // Allow showing again after 7 days
            if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
                setDismissed(true);
            }
        }
    }, []);

    const handleInstall = async () => {
        const success = await installApp();
        if (success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
        setDismissed(true);
        onDismiss?.();
    };

    if (!isInstallable || isInstalled || dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
            >
                <div className="bg-card border border-primary/30 rounded-2xl p-4 shadow-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                            <Smartphone size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">Install Hustly</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Install the app for a better experience with offline access and notifications.
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleInstall}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <Download size={16} />
                                    Install
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                                >
                                    Not now
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Success Toast */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                        <Check size={20} />
                        <span className="font-medium">App installed successfully!</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Component to register SW and add to layout
export function PWAProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(console.error);
        }
    }, []);

    return (
        <>
            {children}
            <PWAInstallPrompt />
        </>
    );
}
