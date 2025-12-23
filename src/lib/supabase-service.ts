import { supabase } from "./supabaseClient";
import {
    Idea,
    Transaction,
    Goal,
    Profile,
    ChatMessage,
    FocusSession,
    Habit,
    HabitCompletion,
    Achievement,
    UserAchievement,
    DailyChallenge,
    UserChallenge,
    WeeklyGoal,
    Notification,
    DailyStats,
} from "./database.types";

// =============================================
// IDEAS (Kanban Board)
// =============================================

export async function getIdeas(): Promise<Idea[]> {
    const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching ideas:", error);
        return [];
    }
    return data || [];
}

export async function createIdea(idea: Partial<Idea>): Promise<Idea | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("ideas")
        .insert({
            ...idea,
            user_id: userData.user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating idea:", error);
        return null;
    }
    return data;
}

export async function updateIdea(id: string, updates: Partial<Idea>): Promise<Idea | null> {
    const { data, error } = await supabase
        .from("ideas")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating idea:", error);
        return null;
    }
    if (data && updates.status === 'done') {
        // Auto-update daily challenge
        await checkDailyChallengeProgress('task_complete');
    }
    return data;
}

export async function deleteIdea(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("ideas")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting idea:", error);
        return false;
    }
    return true;
}

export async function getUpcomingIdeaDeadlines(hours: number = 24): Promise<Idea[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const now = new Date();
    const future = new Date(now.getTime() + hours * 60 * 60 * 1000);

    const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("user_id", userData.user.id)
        .gte("due_date", now.toISOString())
        .lte("due_date", future.toISOString())
        .neq("status", "done");

    if (error) {
        console.error("Error fetching idea deadlines:", error);
        return [];
    }
    return data || [];
}

// =============================================
// TRANSACTIONS (Finance Tracker)
// =============================================

export async function getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
    return data || [];
}

export async function createTransaction(transaction: Partial<Transaction>): Promise<Transaction | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("transactions")
        .insert({
            ...transaction,
            user_id: userData.user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating transaction:", error);
        return null;
    }

    // Update profile total_earnings if income
    if (transaction.type === "income" && transaction.amount) {
        await updateProfileStats({ addEarnings: transaction.amount });
    }

    // Auto-update daily challenge
    await checkDailyChallengeProgress('transaction', 1, { type: transaction.type, amount: transaction.amount });

    return data;
}

export async function deleteTransaction(id: string): Promise<boolean> {
    // Get transaction first to update earnings
    const { data: tx } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", id)
        .single();

    const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting transaction:", error);
        return false;
    }

    // Update profile if was income
    if (tx && tx.type === "income") {
        await updateProfileStats({ addEarnings: -tx.amount });
    }

    return true;
}

// =============================================
// GOALS (Vision Board)
// =============================================

export async function getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching goals:", error);
        return [];
    }
    return data || [];
}

export async function createGoal(goal: Partial<Goal>): Promise<Goal | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("goals")
        .insert({
            ...goal,
            user_id: userData.user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating goal:", error);
        return null;
    }
    return data;
}

export async function updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
    const { data, error } = await supabase
        .from("goals")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating goal:", error);
        return null;
    }
    return data;
}

export async function deleteGoal(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting goal:", error);
        return false;
    }
    return true;
}

// =============================================
// CHAT MESSAGES (Ghost CEO)
// =============================================

export async function getChatMessages(): Promise<ChatMessage[]> {
    const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching chat messages:", error);
        return [];
    }
    return data || [];
}

export async function saveChatMessage(message: Partial<ChatMessage>): Promise<ChatMessage | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("chat_messages")
        .insert({
            ...message,
            user_id: userData.user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving chat message:", error);
        return null;
    }
    return data;
}

export async function clearChatHistory(): Promise<boolean> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("user_id", userData.user.id);

    if (error) {
        console.error("Error clearing chat:", error);
        return false;
    }
    return true;
}

// =============================================
// FOCUS SESSIONS
// =============================================

export async function saveFocusSession(session: Partial<FocusSession>): Promise<FocusSession | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("focus_sessions")
        .insert({
            ...session,
            user_id: userData.user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving focus session:", error);
        return null;
    }

    // Update total focus hours
    if (session.duration_minutes) {
        await updateProfileStats({ addFocusMinutes: session.duration_minutes });
    }

    // Auto-update daily challenge
    if (session.duration_minutes) {
        await checkDailyChallengeProgress('focus_session', session.duration_minutes);
    }

    return data;
}

// =============================================
// PROFILE & STATS
// =============================================

export async function uploadAvatar(file: File): Promise<string | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userData.user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data.publicUrl;
}

export async function getProfile(): Promise<Profile | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
    return data;
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userData.user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        return null;
    }
    return data;
}

interface StatsUpdate {
    addScore?: number;
    addEarnings?: number;
    addFocusMinutes?: number;
}

export async function updateProfileStats(stats: StatsUpdate): Promise<void> {
    const profile = await getProfile();
    if (!profile) return;

    const updates: Partial<Profile> = {};

    if (stats.addScore) {
        updates.productivity_score = (profile.productivity_score || 0) + stats.addScore;
    }
    if (stats.addEarnings) {
        updates.total_earnings = (profile.total_earnings || 0) + stats.addEarnings;
    }
    if (stats.addFocusMinutes) {
        const currentHours = profile.total_focus_hours || 0;
        const additionalHours = Math.floor(stats.addFocusMinutes / 60);
        updates.total_focus_hours = currentHours + additionalHours;
    }

    // Update hustle level based on score
    if (updates.productivity_score !== undefined) {
        updates.hustle_level = calculateHustleLevel(updates.productivity_score);
    }

    if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
    }
}

function calculateHustleLevel(score: number): string {
    if (score >= 5000) return "Empire Builder";
    if (score >= 2000) return "Money Maker";
    if (score >= 1000) return "Boss Mode";
    if (score >= 500) return "Go-Getter";
    if (score >= 100) return "Hustler";
    return "Newbie Hustler";
}

// =============================================
// LEADERBOARD
// =============================================

export interface LeaderboardEntry extends Profile {
    rank: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .gt("productivity_score", 0)
        .order("productivity_score", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }

    return (data || []).map((profile, index) => ({
        ...profile,
        rank: index + 1,
    }));
}

// =============================================
// DASHBOARD STATS
// =============================================

export interface DashboardStats {
    productivityScore: number;
    monthlyIncome: number;
    monthlyExpense: number;
    hustleLevel: string;
    tasksCompleted: number;
    focusHours: number;
    activeGoals: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const profile = await getProfile();

    // Get tasks completed this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: completedTasks } = await supabase
        .from("ideas")
        .select("id")
        .eq("status", "done");

    // Get monthly transactions
    const { data: monthlyTransactions } = await supabase
        .from("transactions")
        .select("amount, type")
        .gte("date", startOfMonth.toISOString().split("T")[0]);

    const monthlyIncome = (monthlyTransactions || [])
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const monthlyExpense = (monthlyTransactions || [])
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Get active goals
    const { data: activeGoals } = await supabase
        .from("goals")
        .select("id")
        .eq("is_completed", false);

    return {
        productivityScore: profile?.productivity_score || 0,
        monthlyIncome,
        monthlyExpense,
        hustleLevel: profile?.hustle_level || "Newbie Hustler",
        tasksCompleted: (completedTasks || []).length,
        focusHours: profile?.total_focus_hours || 0,
        activeGoals: (activeGoals || []).length,
    };
}

export async function getRecentTasks(): Promise<Idea[]> {
    const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching recent tasks:", error);
        return [];
    }
    return data || [];
}

// =============================================
// HABITS TRACKER
// =============================================

export async function getHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching habits:", error);
        return [];
    }
    return data || [];
}

export async function createHabit(habit: Partial<Habit>): Promise<Habit | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("habits")
        .insert({
            ...habit,
            user_id: userData.user.id,
            current_streak: 0,
            best_streak: 0,
            total_completions: 0,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating habit:", error);
        return null;
    }
    return data;
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | null> {
    const { data, error } = await supabase
        .from("habits")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating habit:", error);
        return null;
    }
    return data;
}

export async function deleteHabit(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("habits")
        .update({ is_active: false })
        .eq("id", id);

    if (error) {
        console.error("Error deleting habit:", error);
        return false;
    }
    return true;
}

export async function getHabitCompletions(habitId?: string, startDate?: string, endDate?: string): Promise<HabitCompletion[]> {
    let query = supabase.from("habit_completions").select("*");

    if (habitId) {
        query = query.eq("habit_id", habitId);
    }
    if (startDate) {
        query = query.gte("completed_date", startDate);
    }
    if (endDate) {
        query = query.lte("completed_date", endDate);
    }

    const { data, error } = await query.order("completed_date", { ascending: false });

    if (error) {
        console.error("Error fetching habit completions:", error);
        return [];
    }
    return data || [];
}

export async function completeHabit(habitId: string, date?: string): Promise<HabitCompletion | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const completedDate = date || new Date().toISOString().split('T')[0];

    // Check if already completed today
    const { data: existing } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("habit_id", habitId)
        .eq("completed_date", completedDate)
        .single();

    if (existing) {
        return existing;
    }

    const { data, error } = await supabase
        .from("habit_completions")
        .insert({
            habit_id: habitId,
            user_id: userData.user.id,
            completed_date: completedDate,
        })
        .select()
        .single();

    if (error) {
        console.error("Error completing habit:", error);
        return null;
    }

    // Update habit streaks
    await updateHabitStreak(habitId);

    // Update daily stats
    await updateDailyStats({ addHabitsCompleted: 1 });

    // Auto-update daily challenge
    await checkDailyChallengeProgress('habit_complete');

    return data;
}

export async function uncompleteHabit(habitId: string, date: string): Promise<boolean> {
    const { error } = await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habitId)
        .eq("completed_date", date);

    if (error) {
        console.error("Error uncompleting habit:", error);
        return false;
    }

    await updateHabitStreak(habitId);
    return true;
}

async function updateHabitStreak(habitId: string): Promise<void> {
    const { data: completions } = await supabase
        .from("habit_completions")
        .select("completed_date")
        .eq("habit_id", habitId)
        .order("completed_date", { ascending: false });

    if (!completions || completions.length === 0) {
        await supabase.from("habits").update({ current_streak: 0 }).eq("id", habitId);
        return;
    }

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < completions.length; i++) {
        const completionDate = new Date(completions[i].completed_date);
        completionDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (completionDate.getTime() === expectedDate.getTime()) {
            streak++;
        } else if (i === 0 && completionDate.getTime() === expectedDate.getTime() - 86400000) {
            // Allow for yesterday if not yet completed today
            continue;
        } else {
            break;
        }
    }

    // Get current best streak
    const { data: habit } = await supabase
        .from("habits")
        .select("best_streak, total_completions")
        .eq("id", habitId)
        .single();

    const bestStreak = Math.max(habit?.best_streak || 0, streak);
    const totalCompletions = completions.length;

    await supabase
        .from("habits")
        .update({
            current_streak: streak,
            best_streak: bestStreak,
            total_completions: totalCompletions,
        })
        .eq("id", habitId);
}

// =============================================
// ACHIEVEMENTS SYSTEM
// =============================================

export async function getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("points", { ascending: true });

    if (error) {
        console.error("Error fetching achievements:", error);
        return [];
    }
    return data || [];
}

export async function getUserAchievements(): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievements(*)")
        .eq("user_id", userData.user.id)
        .order("unlocked_at", { ascending: false });

    if (error) {
        console.error("Error fetching user achievements:", error);
        return [];
    }
    return data || [];
}

export async function checkAndUnlockAchievements(): Promise<Achievement[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    // Get user stats
    const profile = await getProfile();
    const { data: completedTasks } = await supabase
        .from("ideas")
        .select("id")
        .eq("status", "done");

    const { data: totalIncome } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "income");

    const { data: habits } = await supabase
        .from("habits")
        .select("current_streak, best_streak, total_completions");

    // Calculate values
    const tasksCompleted = completedTasks?.length || 0;
    const incomeTotal = totalIncome?.reduce((sum, t) => sum + t.amount, 0) || 0;
    const maxStreak = Math.max(...(habits?.map(h => h.best_streak) || [0]));
    const habitsCompleted = habits?.reduce((sum, h) => sum + h.total_completions, 0) || 0;

    // Get all achievements not yet unlocked
    const { data: unlockedIds } = await supabase
        .from("user_achievements")
        .select("achievement_id")
        .eq("user_id", userData.user.id);

    const unlockedIdSet = new Set(unlockedIds?.map(u => u.achievement_id) || []);

    const { data: achievements } = await supabase
        .from("achievements")
        .select("*");

    const newlyUnlocked: Achievement[] = [];

    for (const achievement of achievements || []) {
        if (unlockedIdSet.has(achievement.id)) continue;

        let shouldUnlock = false;

        switch (achievement.requirement_type) {
            case 'tasks_completed':
                shouldUnlock = tasksCompleted >= achievement.requirement_value;
                break;
            case 'total_income':
            case 'first_income':
                shouldUnlock = incomeTotal >= achievement.requirement_value;
                break;
            case 'habit_streak':
                shouldUnlock = maxStreak >= achievement.requirement_value;
                break;
            case 'habits_completed':
                shouldUnlock = habitsCompleted >= achievement.requirement_value;
                break;
        }

        if (shouldUnlock) {
            const { error } = await supabase
                .from("user_achievements")
                .insert({
                    user_id: userData.user.id,
                    achievement_id: achievement.id,
                    unlocked_at: new Date().toISOString(),
                });

            if (!error) {
                newlyUnlocked.push(achievement);

                // Create notification
                await createNotification({
                    type: 'achievement',
                    title: '🏆 Achievement Unlocked!',
                    message: `You earned "${achievement.title}" - ${achievement.description}`,
                    data: { achievement_id: achievement.id },
                });

                // Add points to productivity score
                await updateProfileStats({ addScore: achievement.points });
            }
        }
    }

    return newlyUnlocked;
}

// =============================================
// DAILY CHALLENGES
// =============================================

// Challenge templates for auto-generation
// Challenge templates for auto-generation (50 Diverse Challenges)
const CHALLENGE_TEMPLATES = [
    // PRODUCTIVITY (Task Focused)
    { title: "Power Trio", description: "Complete 3 high-priority tasks today.", challenge_type: "tasks", target_value: 3, points_reward: 50 },
    { title: "Task Crusher", description: "Complete 5 tasks to dominate the day.", challenge_type: "tasks", target_value: 5, points_reward: 75 },
    { title: "Clear the Decks", description: "Complete 8 tasks. Empty that backlog!", challenge_type: "tasks", target_value: 8, points_reward: 120 },
    { title: "Single Focus", description: "Complete 1 major task (High Priority).", challenge_type: "tasks", target_value: 1, points_reward: 40 },
    { title: "Morning Momentum", description: "Complete a task before 10 AM.", challenge_type: "early_task", target_value: 1, points_reward: 45 },
    { title: "Quick Wins", description: "Complete 3 quick/low priority tasks.", challenge_type: "tasks", target_value: 3, points_reward: 35 },
    { title: "Weekend Warrior", description: "Complete 5 tasks over the weekend.", challenge_type: "tasks", target_value: 5, points_reward: 60 },
    { title: "Review Day", description: "Clear out your 'Review' column tasks.", challenge_type: "tasks", target_value: 2, points_reward: 40 },
    { title: "Inbox Zero", description: "Process and organize 5 backlog ideas.", challenge_type: "tasks", target_value: 5, points_reward: 50 },
    { title: "Project Finisher", description: "Mark a major project/collection as Done.", challenge_type: "tasks", target_value: 1, points_reward: 100 },

    // FOCUS (Deep Work)
    { title: "Deep Dive", description: "Log 60 minutes of uninterrupted focus.", challenge_type: "focus", target_value: 60, points_reward: 50 },
    { title: "Focus Master", description: "Log 2 hours (120 min) of pure focus.", challenge_type: "focus", target_value: 120, points_reward: 80 },
    { title: "Flow State", description: "Complete 4 focus sessions today.", challenge_type: "focus", target_value: 4, points_reward: 70 },
    { title: "The Marathon", description: "Log 4 hours of focus today. You beast!", challenge_type: "focus", target_value: 240, points_reward: 150 },
    { title: "Pomodoro Pro", description: "Complete 3 Pomodoro sessions (25m each).", challenge_type: "focus", target_value: 75, points_reward: 55 },
    { title: "Zen Mode", description: "Log 30 minutes of focus before noon.", challenge_type: "focus", target_value: 30, points_reward: 40 },
    { title: "Evening Grind", description: "Log 60 minutes of focus after 6 PM.", challenge_type: "focus", target_value: 60, points_reward: 60 },
    { title: "Short Burst", description: "Complete a 15-minute intense focus sprint.", challenge_type: "focus", target_value: 15, points_reward: 20 },
    { title: "Focus Streak", description: "Hit your daily focus target 2 days in a row.", challenge_type: "focus", target_value: 1, points_reward: 50 },
    { title: "Distraction Free", description: "Log a 90-minute session without pauses.", challenge_type: "focus", target_value: 90, points_reward: 100 },

    // HABITS (Consistency)
    { title: "Habit Hero", description: "Complete 3 different habits today.", challenge_type: "habits", target_value: 3, points_reward: 50 },
    { title: "Perfect Day", description: "Complete ALL your active habits.", challenge_type: "habits", target_value: 5, points_reward: 100 },
    { title: "Streak Keeper", description: "Extend a habit streak today.", challenge_type: "habits", target_value: 1, points_reward: 30 },
    { title: "New Routine", description: "Complete a newly created habit.", challenge_type: "habits", target_value: 1, points_reward: 40 },
    { title: "Consistency King", description: "Complete 5 habits today.", challenge_type: "habits", target_value: 5, points_reward: 80 },
    { title: "Health Check", description: "Complete a health-related habit.", challenge_type: "habits", target_value: 1, points_reward: 35 },
    { title: "Learning Log", description: "Complete a learning/skill habit.", challenge_type: "habits", target_value: 1, points_reward: 35 },
    { title: "Mindfulness", description: "Complete a meditation or reflection habit.", challenge_type: "habits", target_value: 1, points_reward: 35 },
    { title: "Fitness First", description: "Complete a workout habit early in the day.", challenge_type: "habits", target_value: 1, points_reward: 45 },
    { title: "Double Trouble", description: "Complete 2 habits before lunch.", challenge_type: "habits", target_value: 2, points_reward: 50 },

    // FINANCE (Money Moves)
    { title: "Money Maker", description: "Log an income transaction today.", challenge_type: "income", target_value: 1, points_reward: 60 },
    { title: "Expense Tracker", description: "Log 3 expense transactions. Track every cent!", challenge_type: "finance", target_value: 3, points_reward: 40 },
    { title: "Savings Goal", description: "Add money to a Goal tracker.", challenge_type: "finance", target_value: 1, points_reward: 50 },
    { title: "Budget Boss", description: "Review your finances and log a transaction.", challenge_type: "finance", target_value: 1, points_reward: 30 },
    { title: "High Roller", description: "Log an income over $100.", challenge_type: "income", target_value: 1, points_reward: 100 },
    { title: "Frugal Day", description: "Log 0 expenses today (Manual check).", challenge_type: "finance", target_value: 1, points_reward: 80 },
    { title: "Investment", description: "Log an 'Investment' category transaction.", challenge_type: "finance", target_value: 1, points_reward: 70 },
    { title: "Side Hustle", description: "Log income from a 'Side Hustle' category.", challenge_type: "income", target_value: 1, points_reward: 90 },
    { title: "Audit", description: "Update a Transaction category or note.", challenge_type: "finance", target_value: 1, points_reward: 20 },
    { title: "Goal Crusher", description: "Reach 50% on any financial goal.", challenge_type: "finance", target_value: 1, points_reward: 120 },

    // LIFESTYLE & MISC
    { title: "Early Riser", description: "Open the app before 8 AM.", challenge_type: "login", target_value: 1, points_reward: 30 },
    { title: "Night Shift", description: "Log activity after 10 PM.", challenge_type: "login", target_value: 1, points_reward: 40 },
    { title: "Weekend Prep", description: "Create 3 tasks on a Friday.", challenge_type: "planning", target_value: 3, points_reward: 45 },
    { title: "Weekly Planner", description: "Create 5 tasks on a Monday.", challenge_type: "planning", target_value: 5, points_reward: 50 },
    { title: "Social Butterfly", description: "Share an achievement (Mock).", challenge_type: "social", target_value: 1, points_reward: 30 },
    { title: "Clean Slate", description: "Complete all overdue tasks.", challenge_type: "cleanup", target_value: 1, points_reward: 150 },
    { title: "Idea Machine", description: "Create 3 new ideas in the backlog.", challenge_type: "creation", target_value: 3, points_reward: 45 },
    { title: "Tag Master", description: "Add tags to 3 different tasks.", challenge_type: "organization", target_value: 3, points_reward: 30 },
    { title: "Descriptionist", description: "Add detailed descriptions to 2 tasks.", challenge_type: "organization", target_value: 2, points_reward: 40 },
    { title: "Full House", description: "Log a Task, a Habit, and a Transaction today.", challenge_type: "combo", target_value: 3, points_reward: 200 },
];

export async function getTodayChallenge(): Promise<DailyChallenge | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const today = new Date().toISOString().split('T')[0];

    try {
        // 1. Check if user ALREADY has a challenge assigned for today
        // We fetch the last few assignments and perform client-side matching to ensure robustness
        const { data: recentUserChallenges } = await supabase
            .from("user_challenges")
            .select(`
                *,
                daily_challenges (*)
            `)
            .eq("user_id", userData.user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (recentUserChallenges) {
            for (const uc of recentUserChallenges) {
                // @ts-ignore
                const dc = uc.daily_challenges as DailyChallenge;
                // Check if the linked daily challenge is for TODAY
                if (dc && dc.date === today) {
                    return dc;
                }
            }
        }

        // 2. Pick a random template
        const randomIndex = Math.floor(Math.random() * CHALLENGE_TEMPLATES.length);
        const template = CHALLENGE_TEMPLATES[randomIndex];

        // 3. Try to getting ANY challenge for today (Global sync)
        let dayChallenge: DailyChallenge | null = null;

        // Check if this template instance exists
        const { data: existingInstance } = await supabase
            .from("daily_challenges")
            .select("*")
            .eq("date", today)
            .eq("title", template.title)
            .maybeSingle();

        if (existingInstance) {
            dayChallenge = existingInstance;
        } else {
            // Create it
            const { data: created, error: insertError } = await supabase
                .from("daily_challenges")
                .insert({
                    date: today,
                    title: template.title,
                    description: template.description,
                    challenge_type: template.challenge_type,
                    target_value: template.target_value,
                    points_reward: template.points_reward,
                })
                .select()
                .single();

            if (insertError) {
                if (insertError.code === '23505') { // Conflict
                    const { data: retry } = await supabase
                        .from("daily_challenges")
                        .select("*")
                        .eq("date", today)
                        .eq("title", template.title)
                        .maybeSingle();
                    dayChallenge = retry;
                }
            } else {
                dayChallenge = created;
            }
        }

        // 4. Fallback: If creation failed (permissions/auth), try to get *ANY* challenge for today
        if (!dayChallenge) {
            const { data: anyChallenge } = await supabase
                .from("daily_challenges")
                .select("*")
                .eq("date", today)
                .limit(1)
                .maybeSingle();
            dayChallenge = anyChallenge;
        }

        // 5. Ultimate Fallback
        if (!dayChallenge) {
            console.warn("Using offline fallback challenge");
            dayChallenge = {
                id: 'fallback-id',
                created_at: new Date().toISOString(),
                date: today,
                title: template.title,
                description: template.description,
                challenge_type: template.challenge_type,
                target_value: template.target_value,
                points_reward: template.points_reward,
            } as DailyChallenge;
            return dayChallenge;
        }

        // 6. Assign to user
        if (dayChallenge.id !== 'fallback-id') {
            const { error: assignError } = await supabase
                .from("user_challenges")
                .insert({
                    user_id: userData.user.id,
                    challenge_id: dayChallenge.id,
                    current_progress: 0,
                    is_completed: false
                });

            if (assignError && assignError.code !== '23505') {
                console.error("Assign error", assignError);
            }
        }

        return dayChallenge;

    } catch (e) {
        console.error("Unexpected error in getTodayChallenge:", e);
        const randomIndex = Math.floor(Math.random() * CHALLENGE_TEMPLATES.length);
        const template = CHALLENGE_TEMPLATES[randomIndex];
        return {
            id: 'error-fallback',
            created_at: new Date().toISOString(),
            date: today,
            title: template.title,
            description: template.description,
            challenge_type: template.challenge_type,
            target_value: template.target_value,
            points_reward: template.points_reward,
        } as DailyChallenge;
    }
}

export async function getUserChallengeProgress(challengeId: string): Promise<UserChallenge | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("challenge_id", challengeId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching challenge progress:", error);
    }
    return data;
}

export async function updateChallengeProgress(challengeId: string, progress: number): Promise<UserChallenge | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const existing = await getUserChallengeProgress(challengeId);

    if (existing) {
        const { data, error } = await supabase
            .from("user_challenges")
            .update({
                current_progress: progress,
                is_completed: existing.is_completed,
            })
            .eq("id", existing.id)
            .select()
            .single();

        if (error) {
            console.error("Error updating challenge progress:", error);
            return null;
        }
        return data;
    } else {
        const { data, error } = await supabase
            .from("user_challenges")
            .insert({
                user_id: userData.user.id,
                challenge_id: challengeId,
                current_progress: progress,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating challenge progress:", error);
            return null;
        }
        return data;
    }
}

export async function completeDailyChallenge(challengeId: string): Promise<boolean> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { data: challenge } = await supabase
        .from("daily_challenges")
        .select("*")
        .eq("id", challengeId)
        .single();

    if (!challenge) return false;

    const { error } = await supabase
        .from("user_challenges")
        .update({
            is_completed: true,
            completed_at: new Date().toISOString(),
        })
        .eq("user_id", userData.user.id)
        .eq("challenge_id", challengeId);

    if (error) {
        console.error("Error completing challenge:", error);
        return false;
    }

    // Award points
    await updateProfileStats({ addScore: challenge.points_reward });

    // Create notification
    await createNotification({
        type: 'challenge',
        title: '🎯 Challenge Completed!',
        message: `You completed "${challenge.title}" and earned ${challenge.points_reward} points!`,
    });

    return true;
}

// Helper to update challenge progress automatically
export async function checkDailyChallengeProgress(
    actionType: 'task_complete' | 'focus_session' | 'transaction' | 'habit_complete' | 'login',
    value: number = 1,
    metadata?: any
) {
    // 1. Get today's challenge
    const challenge = await getTodayChallenge();
    if (!challenge) return;

    // 2. Get current progress
    const userProgress = await getUserChallengeProgress(challenge.id);
    if (!userProgress || userProgress.is_completed) return;

    let shouldUpdate = false;
    let increment = 0;

    // 3. Check if action matches challenge type
    switch (challenge.challenge_type) {
        case 'tasks':
        case 'early_task':
        case 'cleanup':
        case 'organization':
            if (actionType === 'task_complete') {
                shouldUpdate = true;
                increment = 1;
            }
            break;
        case 'focus':
            if (actionType === 'focus_session') {
                shouldUpdate = true;
                increment = value;
            }
            break;
        case 'finance':
        case 'income':
            if (actionType === 'transaction') {
                if (challenge.challenge_type === 'income' && metadata?.type !== 'income') {
                    shouldUpdate = false;
                } else if (challenge.challenge_type === 'income' && metadata?.amount && challenge.target_value > 10 && metadata.amount < challenge.target_value) {
                    // Special case for "Log income over $100" where target_value is actually the amount, not count
                    // But usually target_value is COUNT (e.g. 1 income tx). 
                    // Let's assume target_value is always Count for now unless we change schema.
                    shouldUpdate = true;
                    increment = 1;
                } else {
                    shouldUpdate = true;
                    increment = 1;
                }
            }
            break;
        case 'habits':
            if (actionType === 'habit_complete') {
                shouldUpdate = true;
                increment = 1;
            }
            break;
        case 'combo':
            if (['task_complete', 'habit_complete', 'transaction'].includes(actionType)) {
                shouldUpdate = true;
                increment = 1;
            }
            break;
    }

    // 4. Update if matched
    if (shouldUpdate) {
        // Safe increment
        const current = userProgress.current_progress || 0;
        const newProgress = current + increment;

        await updateChallengeProgress(challenge.id, newProgress);

        // 5. Complete if target reached
        if (newProgress >= challenge.target_value) {
            await completeDailyChallenge(challenge.id);
        }
    }
}

// =============================================
// WEEKLY GOALS
// =============================================

export async function getWeeklyGoals(): Promise<WeeklyGoal[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    // Get start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("weekly_goals")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("week_start", weekStart.toISOString().split('T')[0])
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching weekly goals:", error);
        return [];
    }
    return data || [];
}

export async function createWeeklyGoal(goal: Partial<WeeklyGoal>): Promise<WeeklyGoal | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    // Get start of current week
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("weekly_goals")
        .insert({
            ...goal,
            user_id: userData.user.id,
            week_start: weekStart.toISOString().split('T')[0],
            current_value: 0,
            is_completed: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating weekly goal:", error);
        return null;
    }
    return data;
}

export async function updateWeeklyGoalProgress(goalId: string, value: number): Promise<WeeklyGoal | null> {
    const { data: goal } = await supabase
        .from("weekly_goals")
        .select("*")
        .eq("id", goalId)
        .single();

    if (!goal) return null;

    const isCompleted = value >= goal.target_value;

    const { data, error } = await supabase
        .from("weekly_goals")
        .update({
            current_value: value,
            is_completed: isCompleted,
        })
        .eq("id", goalId)
        .select()
        .single();

    if (error) {
        console.error("Error updating weekly goal:", error);
        return null;
    }

    if (isCompleted && !goal.is_completed) {
        await createNotification({
            type: 'achievement',
            title: '🎯 Weekly Goal Achieved!',
            message: `You completed "${goal.title}"!`,
        });
        await updateProfileStats({ addScore: 50 });
    }

    return data;
}

// =============================================
// NOTIFICATIONS
// =============================================

export async function getNotifications(unreadOnly = false): Promise<Notification[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

    if (unreadOnly) {
        query = query.eq("is_read", false);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
    return data || [];
}

export async function getUnreadNotificationCount(): Promise<number> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return 0;

    const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userData.user.id)
        .eq("is_read", false);

    if (error) {
        console.error("Error fetching notification count:", error);
        return 0;
    }
    return count || 0;
}

export async function createNotification(notification: Partial<Notification>): Promise<Notification | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("notifications")
        .insert({
            ...notification,
            user_id: userData.user.id,
            is_read: false,
            sent_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating notification:", error);
        return null;
    }
    return data;
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

    if (error) {
        console.error("Error marking notification as read:", error);
        return false;
    }
    return true;
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userData.user.id)
        .eq("is_read", false);

    if (error) {
        console.error("Error marking all notifications as read:", error);
        return false;
    }
    return true;
}

export async function generateMorningBriefing(): Promise<Notification | null> {
    const stats = await getDashboardStats();
    const habits = await getHabits();
    const weeklyGoals = await getWeeklyGoals();

    const pendingHabits = habits.length;
    const incompleteGoals = weeklyGoals.filter(g => !g.is_completed).length;

    const messages = [
        `Good morning, hustler! 🌅`,
        `You have ${pendingHabits} habits to complete today.`,
        `${incompleteGoals} weekly goals are in progress.`,
        `Your productivity score is ${stats.productivityScore}. Let's make it higher!`,
        `Current level: ${stats.hustleLevel}`,
    ];

    return await createNotification({
        type: 'briefing',
        title: '☀️ Morning Briefing',
        message: messages.join('\n'),
    });
}

// =============================================
// ANALYTICS / DAILY STATS
// =============================================

export async function getDailyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data, error } = await supabase
        .from("daily_stats")
        .select("*")
        .eq("user_id", userData.user.id)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

    if (error) {
        console.error("Error fetching daily stats:", error);
        return [];
    }
    return data || [];
}

export async function getTodayStats(): Promise<DailyStats | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from("daily_stats")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("date", today)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching today's stats:", error);
    }
    return data;
}

interface DailyStatsUpdate {
    addTasksCompleted?: number;
    addTasksCreated?: number;
    addFocusMinutes?: number;
    addIncome?: number;
    addExpense?: number;
    addHabitsCompleted?: number;
}

export async function updateDailyStats(updates: DailyStatsUpdate): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const today = new Date().toISOString().split('T')[0];
    const existing = await getTodayStats();

    if (existing) {
        const newStats: Partial<DailyStats> = {};

        if (updates.addTasksCompleted) {
            newStats.tasks_completed = (existing.tasks_completed || 0) + updates.addTasksCompleted;
        }
        if (updates.addTasksCreated) {
            newStats.tasks_created = (existing.tasks_created || 0) + updates.addTasksCreated;
        }
        if (updates.addFocusMinutes) {
            newStats.focus_minutes = (existing.focus_minutes || 0) + updates.addFocusMinutes;
        }
        if (updates.addIncome) {
            newStats.income = (existing.income || 0) + updates.addIncome;
        }
        if (updates.addExpense) {
            newStats.expense = (existing.expense || 0) + updates.addExpense;
        }
        if (updates.addHabitsCompleted) {
            newStats.habits_completed = (existing.habits_completed || 0) + updates.addHabitsCompleted;
        }

        // Calculate productivity score for the day
        newStats.productivity_score =
            (newStats.tasks_completed || existing.tasks_completed || 0) * 10 +
            (newStats.habits_completed || existing.habits_completed || 0) * 5 +
            Math.floor((newStats.focus_minutes || existing.focus_minutes || 0) / 30) * 5;

        await supabase
            .from("daily_stats")
            .update(newStats)
            .eq("id", existing.id);
    } else {
        // Create new daily stats entry
        await supabase
            .from("daily_stats")
            .insert({
                user_id: userData.user.id,
                date: today,
                tasks_completed: updates.addTasksCompleted || 0,
                tasks_created: updates.addTasksCreated || 0,
                focus_minutes: updates.addFocusMinutes || 0,
                income: updates.addIncome || 0,
                expense: updates.addExpense || 0,
                habits_completed: updates.addHabitsCompleted || 0,
                productivity_score: (updates.addTasksCompleted || 0) * 10 + (updates.addHabitsCompleted || 0) * 5,
            });
    }
}

export interface AnalyticsData {
    weeklyProductivity: { date: string; score: number }[];
    monthlyProductivity: { date: string; score: number }[];
    incomeVsExpense: { date: string; income: number; expense: number }[];
    habitCompletionRate: number;
    taskCompletionRate: number;
    mostProductiveDay: string;
    averageDailyScore: number;
    totalFocusHoursThisWeek: number;
    goalsCompletedThisMonth: number;
}

export async function getAnalyticsData(): Promise<AnalyticsData> {
    const now = new Date();

    // Get last 7 days
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Get last 30 days
    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);

    const weeklyStats = await getDailyStats(
        weekAgo.toISOString().split('T')[0],
        now.toISOString().split('T')[0]
    );

    const monthlyStats = await getDailyStats(
        monthAgo.toISOString().split('T')[0],
        now.toISOString().split('T')[0]
    );

    // Calculate weekly productivity
    const weeklyProductivity = weeklyStats.map(s => ({
        date: s.date,
        score: s.productivity_score,
    }));

    // Calculate monthly productivity
    const monthlyProductivity = monthlyStats.map(s => ({
        date: s.date,
        score: s.productivity_score,
    }));

    // Income vs Expense
    const incomeVsExpense = monthlyStats.map(s => ({
        date: s.date,
        income: s.income,
        expense: s.expense,
    }));

    // Calculate rates and averages
    const totalHabitsTarget = weeklyStats.length * 5; // Assume 5 habits per day target
    const totalHabitsCompleted = weeklyStats.reduce((sum, s) => sum + s.habits_completed, 0);
    const habitCompletionRate = totalHabitsTarget > 0
        ? Math.round((totalHabitsCompleted / totalHabitsTarget) * 100)
        : 0;

    const totalTasksCreated = monthlyStats.reduce((sum, s) => sum + s.tasks_created, 0);
    const totalTasksCompleted = monthlyStats.reduce((sum, s) => sum + s.tasks_completed, 0);
    const taskCompletionRate = totalTasksCreated > 0
        ? Math.round((totalTasksCompleted / totalTasksCreated) * 100)
        : 0;

    // Find most productive day
    const dayScores: Record<string, number[]> = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    monthlyStats.forEach(s => {
        const dayOfWeek = new Date(s.date).getDay();
        const dayName = dayNames[dayOfWeek];
        if (!dayScores[dayName]) dayScores[dayName] = [];
        dayScores[dayName].push(s.productivity_score);
    });

    let mostProductiveDay = 'Monday';
    let highestAvg = 0;
    Object.entries(dayScores).forEach(([day, scores]) => {
        const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        if (avg > highestAvg) {
            highestAvg = avg;
            mostProductiveDay = day;
        }
    });

    const averageDailyScore = monthlyStats.length > 0
        ? Math.round(monthlyStats.reduce((sum, s) => sum + s.productivity_score, 0) / monthlyStats.length)
        : 0;

    const totalFocusHoursThisWeek = Math.round(
        weeklyStats.reduce((sum, s) => sum + s.focus_minutes, 0) / 60
    );

    // Get completed goals this month
    const { data: completedGoals } = await supabase
        .from("goals")
        .select("id")
        .eq("is_completed", true)
        .gte("updated_at", monthAgo.toISOString());

    return {
        weeklyProductivity,
        monthlyProductivity,
        incomeVsExpense,
        habitCompletionRate,
        taskCompletionRate,
        mostProductiveDay,
        averageDailyScore,
        totalFocusHoursThisWeek,
        goalsCompletedThisMonth: completedGoals?.length || 0,
    };
}

// =============================================
// TIME BLOCKING
// =============================================

import { TimeBlock, TimeBlockCategory } from "./database.types";

export async function getTimeBlocks(date?: string, startDate?: string, endDate?: string): Promise<TimeBlock[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    let query = supabase
        .from("time_blocks")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("start_time", { ascending: true });

    if (date) {
        // Get blocks for a specific date
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        query = query
            .gte("start_time", dayStart.toISOString())
            .lte("start_time", dayEnd.toISOString());
    } else if (startDate && endDate) {
        query = query
            .gte("start_time", startDate)
            .lte("start_time", endDate);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching time blocks:", error);
        return [];
    }
    return data || [];
}

export async function getTimeBlocksForWeek(date: Date): Promise<TimeBlock[]> {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return getTimeBlocks(undefined, startOfWeek.toISOString(), endOfWeek.toISOString());
}

export async function createTimeBlock(block: Partial<TimeBlock>): Promise<TimeBlock | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
        .from("time_blocks")
        .insert({
            ...block,
            user_id: userData.user.id,
            is_completed: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating time block:", error);
        return null;
    }

    // Schedule reminder notification if reminder_minutes is set
    if (data && data.reminder_minutes && data.reminder_minutes > 0) {
        const reminderTime = new Date(data.start_time);
        reminderTime.setMinutes(reminderTime.getMinutes() - data.reminder_minutes);

        if (reminderTime > new Date()) {
            await createNotification({
                type: 'reminder',
                title: '⏰ Upcoming Time Block',
                message: `"${data.title}" starts in ${data.reminder_minutes} minutes`,
                scheduled_for: reminderTime.toISOString(),
                data: { time_block_id: data.id },
            });
        }
    }

    return data;
}

export async function updateTimeBlock(id: string, updates: Partial<TimeBlock>): Promise<TimeBlock | null> {
    const { data, error } = await supabase
        .from("time_blocks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating time block:", error);
        return null;
    }
    return data;
}

export async function deleteTimeBlock(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("time_blocks")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting time block:", error);
        return false;
    }
    return true;
}

export async function completeTimeBlock(id: string): Promise<TimeBlock | null> {
    const { data, error } = await supabase
        .from("time_blocks")
        .update({
            is_completed: true,
            completed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error completing time block:", error);
        return null;
    }

    if (data) {
        // Calculate duration and add to focus time
        const startTime = new Date(data.start_time);
        const endTime = new Date(data.end_time);
        const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

        if (data.category === 'focus' || data.category === 'work') {
            await updateDailyStats({ addFocusMinutes: durationMinutes });
            await updateProfileStats({ addFocusMinutes: durationMinutes });
        }

        // Add points for completing time block
        await updateProfileStats({ addScore: 5 });

        await createNotification({
            type: 'achievement',
            title: '✅ Time Block Completed',
            message: `Great job completing "${data.title}"!`,
        });
    }

    return data;
}

export async function uncompleteTimeBlock(id: string): Promise<TimeBlock | null> {
    const { data, error } = await supabase
        .from("time_blocks")
        .update({
            is_completed: false,
            completed_at: null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error uncompleting time block:", error);
        return null;
    }
    return data;
}

export async function getTodayTimeBlockStats(): Promise<{
    totalBlocks: number;
    completedBlocks: number;
    totalMinutes: number;
    completedMinutes: number;
}> {
    const today = new Date().toISOString().split('T')[0];
    const blocks = await getTimeBlocks(today);

    let totalMinutes = 0;
    let completedMinutes = 0;

    blocks.forEach(block => {
        const start = new Date(block.start_time);
        const end = new Date(block.end_time);
        const duration = Math.round((end.getTime() - start.getTime()) / 60000);
        totalMinutes += duration;
        if (block.is_completed) {
            completedMinutes += duration;
        }
    });

    return {
        totalBlocks: blocks.length,
        completedBlocks: blocks.filter(b => b.is_completed).length,
        totalMinutes,
        completedMinutes,
    };
}

export async function getUpcomingTimeBlocks(limit = 5): Promise<TimeBlock[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("time_blocks")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("is_completed", false)
        .gte("start_time", now)
        .order("start_time", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("Error fetching upcoming time blocks:", error);
        return [];
    }
    return data || [];
}

export async function getCurrentTimeBlock(): Promise<TimeBlock | null> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from("time_blocks")
        .select("*")
        .eq("user_id", userData.user.id)
        .lte("start_time", now)
        .gte("end_time", now)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching current time block:", error);
    }
    return data;
}

// Get all time blocks that need reminders to be sent
export async function checkAndSendTimeBlockReminders(): Promise<void> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);

    const { data: upcomingBlocks } = await supabase
        .from("time_blocks")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("is_completed", false)
        .gte("start_time", now.toISOString())
        .lte("start_time", thirtyMinutesFromNow.toISOString());

    if (!upcomingBlocks) return;

    for (const block of upcomingBlocks) {
        const startTime = new Date(block.start_time);
        const reminderTime = new Date(startTime.getTime() - block.reminder_minutes * 60 * 1000);

        // If reminder time is within 1 minute of now, send notification
        const timeDiff = Math.abs(now.getTime() - reminderTime.getTime());
        if (timeDiff < 60 * 1000) {
            await createNotification({
                type: 'reminder',
                title: '⏰ Upcoming Time Block',
                message: `"${block.title}" starts in ${block.reminder_minutes} minutes`,
                data: { time_block_id: block.id },
            });
        }
    }
}

// Time block categories with colors
export const TIME_BLOCK_CATEGORIES: Record<TimeBlockCategory, { label: string; color: string; icon: string }> = {
    work: { label: 'Work', color: '#F5A623', icon: '💼' },
    personal: { label: 'Personal', color: '#8B5CF6', icon: '🏠' },
    meeting: { label: 'Meeting', color: '#3B82F6', icon: '👥' },
    break: { label: 'Break', color: '#10B981', icon: '☕' },
    focus: { label: 'Deep Focus', color: '#EF4444', icon: '🎯' },
    other: { label: 'Other', color: '#6B7280', icon: '📌' },
};

