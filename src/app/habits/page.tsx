"use client";

import HabitsTracker from "@/components/HabitsTracker";
import HabitVisualizer from "@/components/HabitVisualizer";

export default function HabitsPage() {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <HabitVisualizer />
            <HabitsTracker />
        </div>
    )
}
