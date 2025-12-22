"use client";

import React, { memo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Lightbulb,
    Wallet,
    Target,
    Bot,
    Settings,
    Crown,
    Trophy,
    LogOut,
    ChevronUp,
    Flame,
    BarChart3,
    Zap,
    Bell,
    CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import { sidebarVariants, easings } from "@/lib/animations";

type NavKey = "dashboard" | "ideaBoard" | "finance" | "visionBoard" | "ghostCeo" | "leaderboard" | "habits" | "achievements" | "analytics" | "goals" | "challenges";

const navItems: { key: NavKey; href: string; icon: typeof LayoutDashboard }[] = [
    { key: "dashboard", href: "/", icon: LayoutDashboard },
    { key: "ideaBoard", href: "/ideas", icon: Lightbulb },
    { key: "habits", href: "/habits", icon: Flame },
    { key: "goals", href: "/goals", icon: CalendarCheck },
    { key: "finance", href: "/finance", icon: Wallet },
    { key: "visionBoard", href: "/vision", icon: Target },
    { key: "analytics", href: "/analytics", icon: BarChart3 },
    { key: "achievements", href: "/achievements", icon: Trophy },
    { key: "challenges", href: "/challenges", icon: Zap },
    { key: "ghostCeo", href: "/chat", icon: Bot },
    { key: "leaderboard", href: "/leaderboard", icon: Crown },
];

// Text animation variants for smooth enter/exit
const textVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.2,
            delay: 0.1,
            ease: easings.easeOut,
        }
    },
    exit: {
        opacity: 0,
        x: -8,
        transition: {
            duration: 0.15,
            ease: easings.easeOut,
        }
    }
};

// Memoized nav item for performance
const NavItem = memo(function NavItem({
    item,
    isActive,
    label,
    isExpanded,
    isLayoutExpanded,
}: {
    item: typeof navItems[0];
    isActive: boolean;
    label: string;
    isExpanded: boolean;
    isLayoutExpanded: boolean;
}) {
    return (
        <Link
            href={item.href}
            className={cn(
                "flex items-center rounded-lg text-sm font-medium group gpu-accelerate relative",
                "h-10", // Fixed height for consistency
                isLayoutExpanded ? "px-3 justify-start gap-3" : "justify-center",
                isActive
                    ? "bg-primary/10 text-primary gold-glow"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
            style={{ transition: "background-color 0.15s, color 0.15s, padding 0.3s ease-out, justify-content 0.3s ease-out" }}
            title={!isLayoutExpanded ? label : undefined}
        >
            <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            )} style={{ transition: "color 0.15s" }} />
            <AnimatePresence mode="wait">
                {isExpanded && (
                    <motion.span
                        key="nav-label"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="whitespace-nowrap overflow-hidden"
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </Link>
    );
});

function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { user, profile, signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    // Separate state for layout - delays collapse to prevent icon jumping
    const [isLayoutExpanded, setIsLayoutExpanded] = useState(false);
    const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    const layoutTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(async () => {
        await signOut();
    }, [signOut]);

    const handleMouseEnter = useCallback(() => {
        // Clear any pending timeouts
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (layoutTimeoutRef.current) {
            clearTimeout(layoutTimeoutRef.current);
            layoutTimeoutRef.current = null;
        }
        setIsExpanded(true);
        setIsLayoutExpanded(true); // Immediately expand layout
    }, []);

    const handleMouseLeave = useCallback(() => {
        // Delay before starting close animation
        hoverTimeoutRef.current = setTimeout(() => {
            setIsExpanded(false);
            setShowUserMenu(false);

            // Delay layout collapse until after all animations complete
            // Text exit (150ms) + sidebar collapse delay (200ms) + sidebar animation (300ms) = ~650ms
            layoutTimeoutRef.current = setTimeout(() => {
                setIsLayoutExpanded(false);
            }, 550); // Total animation time before switching to centered layout
        }, 200); // Initial hover delay
    }, []);

    const toggleUserMenu = useCallback(() => {
        if (isExpanded) {
            setShowUserMenu(prev => !prev);
        }
    }, [isExpanded]);

    // Get display name from profile or user
    const displayName = profile?.full_name || user?.email?.split("@")[0] || "Hustler";
    const initials = displayName.slice(0, 2).toUpperCase();
    const hustleLevel = profile?.hustle_level || "Hustler";

    return (
        <motion.aside
            className="bg-background/80 backdrop-blur-xl hidden md:flex flex-col h-full py-3 relative z-50 border-r border-primary/10 overflow-hidden"
            variants={sidebarVariants}
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ willChange: "width" }}
        >
            {/* Logo */}
            <div className={cn(
                "flex items-center h-10 mb-4",
                isLayoutExpanded ? "px-4 justify-start gap-3" : "justify-center"
            )} style={{ transition: "padding 0.3s ease-out" }}>
                <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                    <Image src="/favicon-96x96.png" alt="Hustly" width={36} height={36} />
                </div>
                <AnimatePresence mode="wait">
                    {isExpanded && (
                        <motion.span
                            key="logo-text"
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="font-bold text-lg tracking-wide whitespace-nowrap overflow-hidden"
                            style={{ color: '#F5A623' }}
                        >
                            HUSTLY
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className={cn("space-y-1 flex-1", isLayoutExpanded ? "px-2" : "px-1.5")} style={{ transition: "padding 0.3s ease-out" }}>
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        item={item}
                        isActive={pathname === item.href}
                        label={t.nav[item.key]}
                        isExpanded={isExpanded}
                        isLayoutExpanded={isLayoutExpanded}
                    />
                ))}
            </nav>

            {/* User Profile */}
            <div className={cn("mt-auto pt-3 border-t border-primary/10", isLayoutExpanded ? "px-2" : "px-1.5")} style={{ transition: "padding 0.3s ease-out" }}>
                {/* User Menu - Show when expanded and menu is open */}
                {isExpanded && showUserMenu && (
                    <motion.div
                        className="mb-2 bg-card/50 border border-primary/10 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15, ease: easings.easeOut }}
                    >
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-primary/10 text-muted-foreground hover:text-white"
                            style={{ transition: "background-color 0.15s, color 0.15s" }}
                            onClick={() => setShowUserMenu(false)}
                        >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Settings</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 w-full hover:bg-red-500/10 text-muted-foreground hover:text-red-400"
                            style={{ transition: "background-color 0.15s, color 0.15s" }}
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Log Out</span>
                        </button>
                    </motion.div>
                )}

                {/* User Avatar/Profile Button */}
                <div
                    onClick={toggleUserMenu}
                    className={cn(
                        "flex items-center rounded-lg hover:bg-white/5 cursor-pointer h-12",
                        isLayoutExpanded ? "px-3 justify-start gap-3" : "justify-center"
                    )}
                    style={{ transition: "background-color 0.15s, padding 0.3s ease-out" }}
                    title={!isLayoutExpanded ? displayName : undefined}
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-black">{initials}</span>
                    </div>
                    <AnimatePresence mode="wait">
                        {isExpanded && (
                            <motion.div
                                key="user-info"
                                className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden"
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                                    <p className="text-[10px] text-primary uppercase font-bold tracking-wider">{hustleLevel}</p>
                                </div>
                                <ChevronUp
                                    className="w-4 h-4 text-muted-foreground flex-shrink-0"
                                    style={{
                                        transform: showUserMenu ? "rotate(0deg)" : "rotate(180deg)",
                                        transition: "transform 0.15s ease-out"
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}

export default memo(Sidebar);
