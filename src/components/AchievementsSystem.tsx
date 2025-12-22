"use client";

import { useState, useEffect, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy,
    Star,
    Lock,
    Sparkles,
    Target,
    DollarSign,
    Flame,
    Calendar,
    Crown,
    Medal,
    Award,
    Zap,
} from "lucide-react";
import { Achievement, UserAchievement } from "@/lib/database.types";
import { transitions, fadeUp, staggerContainer, scaleIn } from "@/lib/animations";
import {
    getAchievements,
    getUserAchievements,
    checkAndUnlockAchievements,
} from "@/lib/supabase-service";

const categoryIcons: Record<string, typeof Trophy> = {
    tasks: Target,
    finance: DollarSign,
    habits: Flame,
    streak: Calendar,
    social: Star,
    special: Sparkles,
};

const rarityColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    common: {
        bg: "bg-slate-500/10",
        border: "border-slate-500/30",
        text: "text-slate-400",
        glow: "",
    },
    rare: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
        glow: "shadow-blue-500/20",
    },
    epic: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-400",
        glow: "shadow-purple-500/30 shadow-lg",
    },
    legendary: {
        bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/50",
        text: "text-amber-400",
        glow: "shadow-amber-500/40 shadow-xl",
    },
};

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    unlockedAt?: string;
}

const AchievementCard = memo(function AchievementCard({ achievement, isUnlocked, unlockedAt }: AchievementCardProps) {
    const rarity = rarityColors[achievement.rarity] || rarityColors.common;
    const CategoryIcon = categoryIcons[achievement.category] || Trophy;

    return (
        <motion.div
            layout
            variants={fadeUp}
            whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
            className={`relative p-4 rounded-2xl border transition-all ${isUnlocked
                    ? `${rarity.bg} ${rarity.border} ${rarity.glow}`
                    : "bg-muted/30 border-border opacity-50"
                }`}
        >
            {/* Rarity indicator */}
            {isUnlocked && achievement.rarity !== "common" && (
                <div className="absolute -top-1 -right-1">
                    <div className={`w-3 h-3 rounded-full ${achievement.rarity === "legendary" ? "bg-amber-500 animate-pulse" :
                            achievement.rarity === "epic" ? "bg-purple-500" :
                                "bg-blue-500"
                        }`} />
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${isUnlocked ? rarity.bg : "bg-muted"
                    }`}>
                    {isUnlocked ? (
                        <span>{achievement.icon}</span>
                    ) : (
                        <Lock size={24} className="text-muted-foreground" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                            {achievement.title}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${rarity.bg} ${rarity.text}`}>
                            {achievement.rarity}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                        {isUnlocked ? achievement.description : "???"}
                    </p>
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <CategoryIcon size={12} />
                            <span className="capitalize">{achievement.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                            <Star size={12} />
                            <span>{achievement.points} pts</span>
                        </div>
                        {isUnlocked && unlockedAt && (
                            <span className="text-muted-foreground">
                                {new Date(unlockedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

interface CategoryFilterProps {
    categories: string[];
    selectedCategory: string | null;
    onSelect: (category: string | null) => void;
}

const CategoryFilter = memo(function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelect(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
            >
                All
            </button>
            {categories.map((category) => {
                const Icon = categoryIcons[category] || Trophy;
                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${selectedCategory === category
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <Icon size={14} />
                        {category}
                    </button>
                );
            })}
        </div>
    );
});

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
}

const ProgressRing = memo(function ProgressRing({ progress, size = 120, strokeWidth = 8 }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-muted"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="text-primary transition-all duration-500"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{progress}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                </div>
            </div>
        </div>
    );
});

export default function AchievementsSystem() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<(UserAchievement & { achievement: Achievement })[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
    const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [allAchievements, unlockedAchievements] = await Promise.all([
                getAchievements(),
                getUserAchievements(),
            ]);
            setAchievements(allAchievements);
            setUserAchievements(unlockedAchievements);

            // Check for new achievements
            const newOnes = await checkAndUnlockAchievements();
            if (newOnes.length > 0) {
                setNewlyUnlocked(newOnes);
                // Refresh user achievements
                const refreshed = await getUserAchievements();
                setUserAchievements(refreshed);
            }

            setIsLoading(false);
        };
        fetchData();
    }, []);

    const unlockedIds = useMemo(() => {
        return new Set(userAchievements.map(ua => ua.achievement_id));
    }, [userAchievements]);

    const categories = useMemo(() => {
        return [...new Set(achievements.map(a => a.category))];
    }, [achievements]);

    const filteredAchievements = useMemo(() => {
        let result = achievements;

        if (selectedCategory) {
            result = result.filter(a => a.category === selectedCategory);
        }

        if (showUnlockedOnly) {
            result = result.filter(a => unlockedIds.has(a.id));
        }

        // Sort by rarity and unlocked status
        const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
        result = [...result].sort((a, b) => {
            const aUnlocked = unlockedIds.has(a.id) ? 0 : 1;
            const bUnlocked = unlockedIds.has(b.id) ? 0 : 1;
            if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        });

        return result;
    }, [achievements, selectedCategory, showUnlockedOnly, unlockedIds]);

    const stats = useMemo(() => {
        const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);
        const earnedPoints = userAchievements.reduce((sum, ua) => sum + (ua.achievement?.points || 0), 0);
        const progress = achievements.length > 0 ? Math.round((unlockedIds.size / achievements.length) * 100) : 0;

        return {
            total: achievements.length,
            unlocked: unlockedIds.size,
            totalPoints,
            earnedPoints,
            progress,
        };
    }, [achievements, userAchievements, unlockedIds]);

    const getUnlockedAt = (achievementId: string) => {
        const ua = userAchievements.find(u => u.achievement_id === achievementId);
        return ua?.unlocked_at;
    };

    return (
        <div className="space-y-6">
            {/* New Achievement Toast */}
            <AnimatePresence>
                {newlyUnlocked.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
                    >
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Trophy size={28} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold">New Achievement{newlyUnlocked.length > 1 ? 's' : ''} Unlocked!</p>
                                <p className="text-white/80 text-sm">
                                    {newlyUnlocked.map(a => a.title).join(', ')}
                                </p>
                            </div>
                            <button
                                onClick={() => setNewlyUnlocked([])}
                                className="ml-4 text-white/60 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Trophy className="text-amber-500" />
                        Achievements
                    </h1>
                    <p className="text-muted-foreground">Unlock badges and earn points</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Progress Ring */}
                <div className="md:col-span-1 p-6 bg-card border border-border rounded-2xl flex items-center justify-center">
                    <ProgressRing progress={stats.progress} />
                </div>

                {/* Stats Cards */}
                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-card border border-border rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Medal size={20} className="text-amber-500" />
                            <span className="text-sm text-muted-foreground">Unlocked</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {stats.unlocked} <span className="text-muted-foreground text-lg">/ {stats.total}</span>
                        </p>
                    </div>

                    <div className="p-4 bg-card border border-border rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Star size={20} className="text-yellow-500" />
                            <span className="text-sm text-muted-foreground">Points Earned</span>
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                            {stats.earnedPoints} <span className="text-muted-foreground text-lg">/ {stats.totalPoints}</span>
                        </p>
                    </div>

                    <div className="p-4 bg-card border border-border rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Crown size={20} className="text-purple-500" />
                            <span className="text-sm text-muted-foreground">Rarest</span>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                            {userAchievements.find(ua => ua.achievement?.rarity === 'legendary')?.achievement?.title ||
                                userAchievements.find(ua => ua.achievement?.rarity === 'epic')?.achievement?.title ||
                                userAchievements.find(ua => ua.achievement?.rarity === 'rare')?.achievement?.title ||
                                'None yet'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showUnlockedOnly}
                        onChange={(e) => setShowUnlockedOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Show unlocked only</span>
                </label>
            </div>

            {/* Achievements Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredAchievements.map((achievement) => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                isUnlocked={unlockedIds.has(achievement.id)}
                                unlockedAt={getUnlockedAt(achievement.id)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {filteredAchievements.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <Award size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No achievements found</p>
                </div>
            )}
        </div>
    );
}
