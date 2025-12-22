"use client";

import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Clock,
    Star,
    Check,
    Target,
    Flame,
    Trophy,
    RefreshCw,
} from "lucide-react";
import { DailyChallenge, UserChallenge } from "@/lib/database.types";
import { fadeUp } from "@/lib/animations";
import {
    getTodayChallenge,
    getUserChallengeProgress,
    updateChallengeProgress,
    completeDailyChallenge,
} from "@/lib/supabase-service";

interface DailyChallengeCardProps {
    challenge: DailyChallenge;
    userProgress: UserChallenge | null;
    onUpdateProgress: (progress: number) => void;
    onComplete: () => void;
}

const DailyChallengeCard = memo(function DailyChallengeCard({
    challenge,
    userProgress,
    onUpdateProgress,
    onComplete,
}: DailyChallengeCardProps) {
    const progress = userProgress?.current_progress || 0;
    const isCompleted = userProgress?.is_completed || false;
    const progressPercent = Math.min(100, Math.round((progress / challenge.target_value) * 100));

    const [localProgress, setLocalProgress] = useState(progress);

    useEffect(() => {
        setLocalProgress(progress);
    }, [progress]);

    const handleIncrement = () => {
        const newProgress = localProgress + 1;
        setLocalProgress(newProgress);
        onUpdateProgress(newProgress);

        if (newProgress >= challenge.target_value && !isCompleted) {
            onComplete();
        }
    };

    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`relative p-6 rounded-2xl border overflow-hidden ${isCompleted
                    ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30"
                    : "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30"
                }`}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500 rounded-full blur-3xl" />
            </div>

            {/* Completed badge */}
            {isCompleted && (
                <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg"
                >
                    <Trophy size={16} />
                    Completed!
                </motion.div>
            )}

            <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${isCompleted ? "bg-amber-500" : "bg-primary"}`}>
                        <Zap size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Today&apos;s Challenge</p>
                        <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
                    </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6">{challenge.description}</p>

                {/* Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold text-foreground">
                            {localProgress} / {challenge.target_value}
                        </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full ${isCompleted ? "bg-amber-500" : "bg-primary"}`}
                        />
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-500">
                        <Star size={18} />
                        <span className="font-bold">{challenge.points_reward} points</span>
                    </div>
                    {!isCompleted && (
                        <button
                            onClick={handleIncrement}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                        >
                            <Check size={18} />
                            Add Progress
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

// Placeholder for when there's no challenge
const NoChallengeCard = memo(function NoChallengeCard() {
    return (
        <div className="p-6 rounded-2xl border border-dashed border-border bg-card/50 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Target size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Challenge Today</h3>
            <p className="text-muted-foreground">Check back tomorrow for a new challenge!</p>
        </div>
    );
});

// Mini version for dashboard
interface DailyChallengeMiniProps {
    className?: string;
}

export function DailyChallengeMini({ className = "" }: DailyChallengeMiniProps) {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [userProgress, setUserProgress] = useState<UserChallenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const challengeData = await getTodayChallenge();
            setChallenge(challengeData);

            if (challengeData) {
                const progressData = await getUserChallengeProgress(challengeData.id);
                setUserProgress(progressData);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className={`p-4 bg-card border border-border rounded-2xl ${className}`}>
                <div className="animate-pulse flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className={`p-4 bg-card border border-border rounded-2xl ${className}`}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                        <Target size={20} className="text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No challenge today</p>
                </div>
            </div>
        );
    }

    const progress = userProgress?.current_progress || 0;
    const isCompleted = userProgress?.is_completed || false;
    const progressPercent = Math.min(100, Math.round((progress / challenge.target_value) * 100));

    return (
        <div className={`p-4 bg-card border border-border rounded-2xl ${className}`}>
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${isCompleted ? "bg-amber-500" : "bg-primary"}`}>
                    <Zap size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Daily Challenge</p>
                    <h4 className="font-semibold text-foreground text-sm truncate">{challenge.title}</h4>
                </div>
                {isCompleted && (
                    <Trophy size={18} className="text-amber-500" />
                )}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all ${isCompleted ? "bg-amber-500" : "bg-primary"}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-muted-foreground">{progress}/{challenge.target_value}</span>
                <span className="text-amber-500 font-medium">{challenge.points_reward} pts</span>
            </div>
        </div>
    );
}

export default function DailyChallenges() {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [userProgress, setUserProgress] = useState<UserChallenge | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        const challengeData = await getTodayChallenge();
        setChallenge(challengeData);

        if (challengeData) {
            const progressData = await getUserChallengeProgress(challengeData.id);
            setUserProgress(progressData);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateProgress = async (progress: number) => {
        if (!challenge) return;
        const updated = await updateChallengeProgress(challenge.id, progress);
        setUserProgress(updated);
    };

    const handleComplete = async () => {
        if (!challenge) return;
        await completeDailyChallenge(challenge.id);
        const updated = await getUserChallengeProgress(challenge.id);
        setUserProgress(updated);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Zap className="text-amber-500" />
                        Daily Challenge
                    </h1>
                    <p className="text-muted-foreground">Complete today&apos;s challenge to earn bonus points</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        Resets at midnight
                    </span>
                </div>
            </div>

            {/* Challenge Card */}
            {challenge ? (
                <DailyChallengeCard
                    challenge={challenge}
                    userProgress={userProgress}
                    onUpdateProgress={handleUpdateProgress}
                    onComplete={handleComplete}
                />
            ) : (
                <NoChallengeCard />
            )}

            {/* Tips */}
            <div className="p-4 bg-card border border-border rounded-2xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Flame size={18} className="text-orange-500" />
                    How to Earn More Points
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>Complete daily challenges for bonus points</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>Maintain habit streaks for multipliers</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>Unlock achievements for big rewards</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span>Complete weekly goals on time</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
