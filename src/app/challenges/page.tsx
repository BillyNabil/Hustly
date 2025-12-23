"use client";

import DailyChallenges from "@/components/DailyChallenges";
import ChallengesVisualizer from "@/components/ChallengesVisualizer";

export default function ChallengesPage() {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <ChallengesVisualizer />
            <DailyChallenges />
        </div>
    )
}
