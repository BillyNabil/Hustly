"use client";

import WeeklyGoals from "@/components/WeeklyGoals";
import GoalsVisualizer from "@/components/GoalsVisualizer";

export default function GoalsPage() {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <GoalsVisualizer />
            <WeeklyGoals />
        </div>
    )
}
