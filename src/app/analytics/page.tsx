"use client";

import { useState, useEffect } from "react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import AnalyticsVisualizer from "@/components/AnalyticsVisualizer";
import { ModernBackground } from "@/components/ModernBackground";
import { getDashboardStats, DashboardStats } from "@/lib/supabase-service";

export default function AnalyticsPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const data = await getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="h-full overflow-y-auto pb-8 relative">
            <ModernBackground className="fixed inset-0 z-0 opacity-40 pointer-events-none" />
            <div className="relative z-10 p-2 md:p-8">
                <AnalyticsVisualizer
                    score={stats?.productivityScore || 0}
                    tasksCompleted={stats?.tasksCompleted || 0}
                />
                <AnalyticsDashboard />
            </div>
        </div>
    )
}
