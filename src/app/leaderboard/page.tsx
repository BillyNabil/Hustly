"use client";

import Leaderboard from "@/components/Leaderboard";
import LeaderboardVisualizer from "@/components/LeaderboardVisualizer";

export default function LeaderboardPage() {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <LeaderboardVisualizer />
            <Leaderboard showFull={true} />
        </div>
    )
}
