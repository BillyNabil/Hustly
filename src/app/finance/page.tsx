"use client";

import { useState, useEffect } from "react";
import FinanceTracker from "@/components/FinanceTracker";
import FinanceVisualizer from "@/components/FinanceVisualizer";
import { getDashboardStats, DashboardStats } from "@/lib/supabase-service";

export default function FinancePage() {
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
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <FinanceVisualizer
                monthlyIncome={stats?.monthlyIncome || 0}
                monthlyExpense={stats?.monthlyExpense || 0}
            />
            <FinanceTracker />
        </div>
    )
}
