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
            layout
            className={`relative p-6 rounded-2xl border overflow-hidden transition-all duration-500 group ${isCompleted
                ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                : "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 hover:border-primary/50"
                }`}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500 rounded-full blur-3xl" />
            </div>

            {/* Celebration Confetti when completed */}
            {isCompleted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-amber-400 rounded-full"
                            initial={{ y: -10, x: Math.random() * 300, opacity: 1 }}
                            animate={{ y: 200, rotate: 360, opacity: 0 }}
                            transition={{ duration: 4 + Math.random(), repeat: Infinity, delay: Math.random() }}
                        />
                    ))}
                </div>
            )}

            {/* Completed badge */}
            {isCompleted && (
                <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg z-10"
                >
                    <Trophy size={16} className="fill-white/20" />
                    Completed!
                </motion.div>
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className={`p-3 rounded-xl shadow-inner ${isCompleted ? "bg-amber-500" : "bg-primary"}`}
                    >
                        <Zap size={24} className="text-white fill-white/20" />
                    </motion.div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Today&apos;s Challenge</p>
                        <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
                    </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">{challenge.description}</p>

                {/* Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-bold text-foreground font-mono">
                            {localProgress} / {challenge.target_value}
                        </span>
                    </div>
                    <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                        {/* Striped progress bar pattern */}
                        <div className="absolute inset-0 opacity-10 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }} />

                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className={`h-full relative ${isCompleted ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-primary"}`}
                        >
                            <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-500 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <Star size={18} className="fill-amber-500/20" />
                        <span className="font-bold">{challenge.points_reward} points</span>
                    </div>
                    {!isCompleted && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-xl text-xs font-medium border border-white/5">
                            <RefreshCw size={14} className="animate-spin-slow" />
                            Automatic Tracking Active
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

// Placeholder for when there's no challenge
const NoChallengeCard = memo(function NoChallengeCard() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl border border-dashed border-white/10 bg-card/20 text-center flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group"
        >
            {/* Background Radar Effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    className="w-32 h-32 border border-primary rounded-full absolute"
                />
                <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                    className="w-32 h-32 border border-primary rounded-full absolute"
                />
            </div>

            <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 bg-muted/20 rounded-full flex items-center justify-center relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                    />
                    <Target size={40} className="text-muted-foreground/70" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Active Challenge</h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    All missions for the current cycle have been processed.
                    <br /><span className="text-xs uppercase tracking-widest text-primary mt-2 block opacity-70">Check back at 00:00 for new orders</span>
                </p>
            </div>
        </motion.div>
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
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Zap className="text-amber-500" />
                        Active Mission
                    </h2>
                    <p className="text-muted-foreground text-sm">Complete objectives to earn reputation</p>
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 bg-gradient-to-br from-card to-card/50 border border-white/5 rounded-2xl backdrop-blur-sm"
            >
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/10 rounded-lg">
                        <Flame size={18} className="text-orange-500" />
                    </div>
                    How to Earn More Points
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-0.5 p-1 bg-green-500/20 rounded-full">
                            <Check size={12} className="text-green-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Complete daily challenges for bonus points</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-0.5 p-1 bg-green-500/20 rounded-full">
                            <Check size={12} className="text-green-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Maintain habit streaks for multipliers</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-0.5 p-1 bg-green-500/20 rounded-full">
                            <Check size={12} className="text-green-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Unlock achievements for big rewards</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="mt-0.5 p-1 bg-green-500/20 rounded-full">
                            <Check size={12} className="text-green-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">Complete weekly goals on time</span>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
