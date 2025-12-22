"use client";

import { useState, memo, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  TrendingUp,
  Flame,
  Star,
  ChevronUp,
  ChevronDown,
  Minus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile, HUSTLE_LEVELS } from "@/lib/database.types";
import Link from "next/link";
import { fadeUp, staggerContainer, transitions } from "@/lib/animations";
import { getLeaderboard, LeaderboardEntry } from "@/lib/supabase-service";

const levelColors: Record<string, string> = {
  "Newbie Hustler": "text-slate-400",
  "Side Hustler": "text-blue-400",
  "Grinder": "text-purple-400",
  "Boss Mode": "text-amber-400",
  "Empire Builder": "text-amber-300",
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-300" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  }
};

const getChangeIcon = (change: number) => {
  if (change > 0) {
    return (
      <span className="flex items-center text-green-400 text-xs">
        <ChevronUp className="w-3 h-3" />
        {change}
      </span>
    );
  } else if (change < 0) {
    return (
      <span className="flex items-center text-red-400 text-xs">
        <ChevronDown className="w-3 h-3" />
        {Math.abs(change)}
      </span>
    );
  }
  return <Minus className="w-3 h-3 text-muted-foreground" />;
};

interface LeaderboardProps {
  showFull?: boolean;
}

export default function Leaderboard({ showFull = true }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard from Supabase
  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      const data = await getLeaderboard();
      setLeaderboardData(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  const displayData = showFull ? leaderboardData : leaderboardData.slice(0, 5);

  // Show loading state
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", showFull ? "h-full" : "h-40")}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (leaderboardData.length === 0) {
    return (
      <div className={cn("flex items-center justify-center", showFull ? "h-full" : "h-40")}>
        <div className="text-center">
          <Trophy className="w-12 h-12 text-primary/30 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No hustlers on the board yet!</p>
          <p className="text-xs text-muted-foreground">Be the first to climb the ranks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", showFull ? "h-full" : "glass-panel rounded-2xl border border-primary/10 overflow-hidden")}>
      {!showFull && (
        <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-white">Leaderboard</h3>
          </div>
          <Link href="/leaderboard" className="text-xs text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
      {showFull && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Leaderboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                See how you rank among other hustlers
              </p>
            </div>
          </div>

          {/* Timeframe Filter */}
          <div className="flex gap-2 mb-6">
            {(["weekly", "monthly", "alltime"] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                  timeframe === tf
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-white/5 border border-transparent"
                )}
              >
                {tf === "alltime" ? "All Time" : tf}
              </button>
            ))}
          </div>

          {/* Top 3 Podium */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* 2nd Place */}
            <motion.div
              variants={fadeUp}
              className="mt-8"
            >
              <div className="bg-gradient-to-b from-slate-500/20 to-transparent border border-slate-500/20 rounded-2xl p-4 text-center gpu-accelerate">
                <div className="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-2 border-2 border-slate-400">
                  <span className="text-lg font-bold text-white">
                    {leaderboardData[1]?.full_name?.charAt(0) || "?"}
                  </span>
                </div>
                <Medal className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                <p className="font-bold text-white text-sm truncate">{leaderboardData[1]?.full_name || "---"}</p>
                <p className="text-xs text-muted-foreground">{leaderboardData[1]?.productivity_score || 0} pts</p>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              variants={fadeUp}
            >
              <div className="bg-gradient-to-b from-yellow-500/20 to-transparent border border-yellow-500/30 rounded-2xl p-4 text-center relative gpu-accelerate">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-2 border-2 border-yellow-400 shadow-lg shadow-primary/30">
                  <span className="text-xl font-bold text-black">
                    {leaderboardData[0]?.full_name?.charAt(0) || "?"}
                  </span>
                </div>
                <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <p className="font-bold text-white truncate">{leaderboardData[0]?.full_name || "---"}</p>
                <p className="text-primary font-bold">{leaderboardData[0]?.productivity_score || 0} pts</p>
                <p className="text-[10px] text-primary/70 uppercase tracking-wider mt-1">
                  {leaderboardData[0]?.hustle_level || "---"}
                </p>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              variants={fadeUp}
              className="mt-12"
            >
              <div className="bg-gradient-to-b from-amber-700/20 to-transparent border border-amber-700/20 rounded-2xl p-4 text-center gpu-accelerate">
                <div className="w-12 h-12 rounded-full bg-amber-900 flex items-center justify-center mx-auto mb-2 border-2 border-amber-600">
                  <span className="text-lg font-bold text-white">
                    {leaderboardData[2]?.full_name?.charAt(0) || "?"}
                  </span>
                </div>
                <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <p className="font-bold text-white text-sm truncate">{leaderboardData[2]?.full_name || "---"}</p>
                <p className="text-xs text-muted-foreground">{leaderboardData[2]?.productivity_score || 0} pts</p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Leaderboard List */}
      <div className={cn(
        "bg-card/50 rounded-2xl border border-primary/10 overflow-hidden",
        showFull ? "flex-1" : ""
      )}>
        {!showFull && (
          <div className="px-4 py-3 border-b border-primary/10 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-white text-sm">Top Hustlers</h3>
          </div>
        )}

        <div className={cn("divide-y divide-white/5", showFull ? "overflow-y-auto" : "")}>
          {displayData.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors",
                user.id === "current" && "bg-primary/5 border-l-2 border-primary"
              )}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center">
                {getRankIcon(user.rank)}
              </div>

              {/* Avatar */}
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                user.id === "current"
                  ? "bg-gradient-to-br from-primary to-accent"
                  : "bg-slate-700"
              )}>
                <span className={cn(
                  "text-sm font-bold",
                  user.id === "current" ? "text-black" : "text-white"
                )}>
                  {user.full_name?.charAt(0) || "?"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium truncate",
                  user.id === "current" ? "text-primary" : "text-white"
                )}>
                  {user.full_name}
                  {user.id === "current" && " (You)"}
                </p>
                <p className={cn("text-xs", levelColors[user.hustle_level] || "text-muted-foreground")}>
                  {user.hustle_level}
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="font-bold text-white">{user.productivity_score.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hustle Levels Legend */}
      {showFull && (
        <div className="mt-6 p-4 rounded-2xl border border-primary/10 bg-card/30">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-primary" />
            Hustle Levels
          </h4>
          <div className="grid grid-cols-5 gap-2">
            {HUSTLE_LEVELS.map((level) => (
              <div key={level.name} className="text-center">
                <p className={cn("text-xs font-medium", levelColors[level.name])}>
                  {level.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {level.minScore}+ pts
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
