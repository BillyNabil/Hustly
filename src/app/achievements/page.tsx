"use client";

import AchievementsSystem from "@/components/AchievementsSystem";
import AchievementsVisualizer from "@/components/AchievementsVisualizer";

export default function AchievementsPage() {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <AchievementsVisualizer />
            <AchievementsSystem />
        </div>
    )
}
