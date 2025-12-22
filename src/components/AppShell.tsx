"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import TitleBar from "@/components/TitleBar";
import MobileNav from "@/components/MobileNav";
import FloatingMusicButton from "@/components/FloatingMusicButton";
import HeaderBar from "@/components/HeaderBar";
import { PWAInstallPrompt } from "@/components/PWAProvider";
import { motion } from "framer-motion";
import Image from "next/image";

// Routes that don't require authentication and don't show sidebar
const publicRoutes = ["/landing", "/login", "/register"];

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => pathname.startsWith(route));
}

interface AppShellProps {
    children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const isPublic = isPublicRoute(pathname);

    useEffect(() => {
        if (!loading) {
            // If not logged in and trying to access protected route
            if (!user && !isPublic) {
                router.push("/landing");
            }
        }
    }, [user, loading, isPublic, router]);

    // Show loading state - CLEAN & SIMPLE VERSION
    if (loading) {
        return (
            <div id="app-container" className="flex flex-col h-full will-change-transform">
                <TitleBar />
                <div className="flex-1 flex items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-5">
                        {/* Logo using favicon image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src="/favicon-96x96.png"
                                alt="Hustly"
                                width={64}
                                height={64}
                                priority
                            />
                        </motion.div>

                        {/* Simple loading dots */}
                        <div className="flex items-center gap-1.5">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-primary"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Simple loading text */}
                        <p className="text-sm text-muted-foreground">
                            Loading...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Public routes: no sidebar, full width content
    if (isPublic) {
        return (
            <div id="app-container" className="flex flex-col h-full will-change-transform">
                <TitleBar />
                <main className="flex-1 overflow-auto relative">
                    {children}
                </main>
            </div>
        );
    }

    // Protected routes: with sidebar
    // Redirect if not authenticated (handled in useEffect, but also guard here)
    if (!user) {
        return null; // Will redirect via useEffect
    }

    return (
        <div id="app-container" className="flex flex-col h-full will-change-transform">
            <TitleBar />
            <div className="flex-1 flex overflow-hidden w-full">
                <Sidebar />
                <main className="flex-1 overflow-auto relative pb-20 md:pb-0">
                    {children}
                </main>
            </div>
            <HeaderBar />
            <MobileNav />
            <FloatingMusicButton />
            <PWAInstallPrompt />
        </div>
    );
}
