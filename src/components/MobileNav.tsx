"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Lightbulb,
    Bot,
    Flame,
    MoreHorizontal,
    X,
    Wallet,
    Target,
    BarChart3,
    Trophy,
    Zap,
    Crown,
    Settings,
    CalendarCheck,
    Bell,
    Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Main nav items (4 + More button)
const mainNavItems = [
    { key: "dashboard", href: "/", icon: LayoutDashboard, label: "Home" },
    { key: "ideaBoard", href: "/ideas", icon: Lightbulb, label: "Ideas" },
    { key: "habits", href: "/habits", icon: Flame, label: "Habits" },
    { key: "ghostCeo", href: "/chat", icon: Bot, label: "AI" },
];

// Additional items in "More" menu
const moreNavItems = [
    { key: "notifications", href: "/notifications", icon: Bell, label: "Notifs", color: "text-red-400" },
    { key: "schedule", href: "/schedule", icon: Timer, label: "Time Block", color: "text-primary" },
    { key: "goals", href: "/goals", icon: CalendarCheck, label: "Goals", color: "text-blue-400" },
    { key: "finance", href: "/finance", icon: Wallet, label: "Finance", color: "text-green-400" },
    { key: "visionBoard", href: "/vision", icon: Target, label: "Vision", color: "text-purple-400" },
    { key: "analytics", href: "/analytics", icon: BarChart3, label: "Analytics", color: "text-cyan-400" },
    { key: "achievements", href: "/achievements", icon: Trophy, label: "Badges", color: "text-yellow-400" },
    { key: "challenges", href: "/challenges", icon: Zap, label: "Challenges", color: "text-orange-400" },
    { key: "leaderboard", href: "/leaderboard", icon: Crown, label: "Leaderboard", color: "text-primary" },
    { key: "settings", href: "/settings", icon: Settings, label: "Settings", color: "text-slate-400" },
];

function MobileNav() {
    const pathname = usePathname();
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const toggleMore = useCallback(() => {
        setIsMoreOpen(prev => !prev);
    }, []);

    const closeMore = useCallback(() => {
        setIsMoreOpen(false);
    }, []);

    // Check if current path is in more menu
    const isMoreActive = moreNavItems.some(item => pathname === item.href);

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isMoreOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={closeMore}
                    />
                )}
            </AnimatePresence>

            {/* More Menu Bottom Sheet */}
            <AnimatePresence>
                {isMoreOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-16 left-0 right-0 bg-card border-t border-primary/20 rounded-t-3xl z-50 md:hidden safe-area-bottom"
                    >
                        {/* Handle bar */}
                        <div className="flex justify-center py-3">
                            <div className="w-10 h-1 bg-primary/30 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 pb-3">
                            <h3 className="text-lg font-semibold text-foreground">More Features</h3>
                            <button
                                onClick={closeMore}
                                className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Menu Grid */}
                        <div className="grid grid-cols-4 gap-2 px-4 pb-6">
                            {moreNavItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMore}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl transition-all",
                                            isActive
                                                ? "bg-primary/15 border border-primary/30"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-11 h-11 rounded-xl flex items-center justify-center",
                                            isActive ? "bg-primary/20" : "bg-white/5"
                                        )}>
                                            <item.icon className={cn(
                                                "w-5 h-5",
                                                isActive ? "text-primary" : item.color
                                            )} />
                                        </div>
                                        <span className={cn(
                                            "text-[11px] font-medium text-center",
                                            isActive ? "text-primary" : "text-muted-foreground"
                                        )}>
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-primary/10 md:hidden z-50 safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px]",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={toggleMore}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[60px]",
                            isMoreOpen || isMoreActive
                                ? "text-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        <div className="relative">
                            <MoreHorizontal className={cn(
                                "w-5 h-5",
                                isMoreOpen || isMoreActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            {isMoreActive && !isMoreOpen && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                            )}
                        </div>
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </div>
            </nav>
        </>
    );
}

export default memo(MobileNav);
