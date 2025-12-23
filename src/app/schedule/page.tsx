"use client";

import TimeBlocking from "@/components/TimeBlocking";
import ScheduleVisualizer from "@/components/ScheduleVisualizer";
import { ModernBackground } from "@/components/ModernBackground";

export default function SchedulePage() {
    return (
        <div className="h-full overflow-y-auto pb-8 relative">
            <ModernBackground className="fixed inset-0 z-0 opacity-40 pointer-events-none" />

            <div className="relative z-10 p-2 md:p-8">
                <ScheduleVisualizer />
                <TimeBlocking />
            </div>
        </div>
    );
}
