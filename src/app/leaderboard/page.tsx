import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
    return (
        <div className="p-4 md:p-8 h-full">
            <Leaderboard showFull={true} />
        </div>
    )
}
