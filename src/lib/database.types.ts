// Supabase Database Types for Hustly App

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          display_name: string | null
          avatar_url: string | null
          hustle_level: string
          productivity_score: number
          total_earnings: number
          total_focus_hours: number
          ghost_ceo_persona: 'strict' | 'mentor'
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          hustle_level?: string
          productivity_score?: number
          total_earnings?: number
          total_focus_hours?: number
          ghost_ceo_persona?: 'strict' | 'mentor'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          display_name?: string | null
          avatar_url?: string | null
          hustle_level?: string
          productivity_score?: number
          total_earnings?: number
          total_focus_hours?: number
          ghost_ceo_persona?: 'strict' | 'mentor'
        }
      }
      ideas: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          status: 'backlog' | 'in_progress' | 'review' | 'done'
          priority: 'low' | 'medium' | 'high'
          tags: string[]
          due_date: string | null
          order_index: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          status?: 'backlog' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          tags?: string[]
          due_date?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          status?: 'backlog' | 'in_progress' | 'review' | 'done'
          priority?: 'low' | 'medium' | 'high'
          tags?: string[]
          due_date?: string | null
          order_index?: number
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description: string | null
          source: string | null
          date: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          description?: string | null
          source?: string | null
          date?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          type?: 'income' | 'expense'
          amount?: number
          category?: string
          description?: string | null
          source?: string | null
          date?: string
        }
      }
      goals: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          target_amount: number
          current_amount: number
          image_url: string | null
          deadline: string | null
          is_completed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          target_amount: number
          current_amount?: number
          image_url?: string | null
          deadline?: string | null
          is_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          target_amount?: number
          current_amount?: number
          image_url?: string | null
          deadline?: string | null
          is_completed?: boolean
        }
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          metadata?: Json | null
        }
      }
      focus_sessions: {
        Row: {
          id: string
          created_at: string
          user_id: string
          start_time: string
          end_time: string | null
          duration_minutes: number
          task_description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          start_time: string
          end_time?: string | null
          duration_minutes?: number
          task_description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number
          task_description?: string | null
        }
      }
      // =============================================
      // HABITS TRACKER
      // =============================================
      habits: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          icon: string
          color: string
          frequency: 'daily' | 'weekly' | 'custom'
          target_days: number[] // 0-6 for days of week
          reminder_time: string | null
          current_streak: number
          best_streak: number
          total_completions: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          icon?: string
          color?: string
          frequency?: 'daily' | 'weekly' | 'custom'
          target_days?: number[]
          reminder_time?: string | null
          current_streak?: number
          best_streak?: number
          total_completions?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          icon?: string
          color?: string
          frequency?: 'daily' | 'weekly' | 'custom'
          target_days?: number[]
          reminder_time?: string | null
          current_streak?: number
          best_streak?: number
          total_completions?: number
          is_active?: boolean
        }
      }
      habit_completions: {
        Row: {
          id: string
          created_at: string
          habit_id: string
          user_id: string
          completed_date: string
          note: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          habit_id: string
          user_id: string
          completed_date: string
          note?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          habit_id?: string
          user_id?: string
          completed_date?: string
          note?: string | null
        }
      }
      // =============================================
      // ACHIEVEMENTS SYSTEM
      // =============================================
      achievements: {
        Row: {
          id: string
          created_at: string
          code: string
          title: string
          description: string
          icon: string
          category: 'tasks' | 'finance' | 'habits' | 'streak' | 'social' | 'special'
          points: number
          requirement_type: string
          requirement_value: number
          is_secret: boolean
          rarity: 'common' | 'rare' | 'epic' | 'legendary'
        }
        Insert: {
          id?: string
          created_at?: string
          code: string
          title: string
          description: string
          icon?: string
          category: 'tasks' | 'finance' | 'habits' | 'streak' | 'social' | 'special'
          points?: number
          requirement_type: string
          requirement_value: number
          is_secret?: boolean
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
        }
        Update: {
          id?: string
          created_at?: string
          code?: string
          title?: string
          description?: string
          icon?: string
          category?: 'tasks' | 'finance' | 'habits' | 'streak' | 'social' | 'special'
          points?: number
          requirement_type?: string
          requirement_value?: number
          is_secret?: boolean
          rarity?: 'common' | 'rare' | 'epic' | 'legendary'
        }
      }
      user_achievements: {
        Row: {
          id: string
          created_at: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          notified: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          notified?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          notified?: boolean
        }
      }
      daily_challenges: {
        Row: {
          id: string
          created_at: string
          date: string
          title: string
          description: string
          challenge_type: string
          target_value: number
          points_reward: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          date: string
          title: string
          description: string
          challenge_type: string
          target_value: number
          points_reward?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          date?: string
          title?: string
          description?: string
          challenge_type?: string
          target_value?: number
          points_reward?: number
          is_active?: boolean
        }
      }
      user_challenges: {
        Row: {
          id: string
          created_at: string
          user_id: string
          challenge_id: string
          current_progress: number
          is_completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          challenge_id: string
          current_progress?: number
          is_completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          challenge_id?: string
          current_progress?: number
          is_completed?: boolean
          completed_at?: string | null
        }
      }
      weekly_goals: {
        Row: {
          id: string
          created_at: string
          user_id: string
          week_start: string
          title: string
          description: string | null
          target_value: number
          current_value: number
          goal_type: 'tasks' | 'income' | 'habits' | 'focus_hours' | 'custom'
          is_completed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          week_start: string
          title: string
          description?: string | null
          target_value: number
          current_value?: number
          goal_type: 'tasks' | 'income' | 'habits' | 'focus_hours' | 'custom'
          is_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          week_start?: string
          title?: string
          description?: string | null
          target_value?: number
          current_value?: number
          goal_type?: 'tasks' | 'income' | 'habits' | 'focus_hours' | 'custom'
          is_completed?: boolean
        }
      }
      // =============================================
      // NOTIFICATIONS
      // =============================================
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          type: 'reminder' | 'achievement' | 'deadline' | 'briefing' | 'challenge' | 'system'
          title: string
          message: string
          data: Json | null
          is_read: boolean
          scheduled_for: string | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          type: 'reminder' | 'achievement' | 'deadline' | 'briefing' | 'challenge' | 'system'
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          scheduled_for?: string | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          type?: 'reminder' | 'achievement' | 'deadline' | 'briefing' | 'challenge' | 'system'
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          scheduled_for?: string | null
          sent_at?: string | null
        }
      }
      // =============================================
      // ANALYTICS / DAILY STATS
      // =============================================
      daily_stats: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          tasks_completed: number
          tasks_created: number
          focus_minutes: number
          income: number
          expense: number
          habits_completed: number
          productivity_score: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          tasks_completed?: number
          tasks_created?: number
          focus_minutes?: number
          income?: number
          expense?: number
          habits_completed?: number
          productivity_score?: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          tasks_completed?: number
          tasks_created?: number
          focus_minutes?: number
          income?: number
          expense?: number
          habits_completed?: number
          productivity_score?: number
        }
      }
      // =============================================
      // TIME BLOCKING
      // =============================================
      time_blocks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          color: string
          category: 'work' | 'personal' | 'meeting' | 'break' | 'focus' | 'other'
          is_recurring: boolean
          recurrence_pattern: string | null
          reminder_minutes: number
          is_completed: boolean
          completed_at: string | null
          linked_task_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          color?: string
          category?: 'work' | 'personal' | 'meeting' | 'break' | 'focus' | 'other'
          is_recurring?: boolean
          recurrence_pattern?: string | null
          reminder_minutes?: number
          is_completed?: boolean
          completed_at?: string | null
          linked_task_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          color?: string
          category?: 'work' | 'personal' | 'meeting' | 'break' | 'focus' | 'other'
          is_recurring?: boolean
          recurrence_pattern?: string | null
          reminder_minutes?: number
          is_completed?: boolean
          completed_at?: string | null
          linked_task_id?: string | null
          notes?: string | null
        }
      },
      Views: {
        leaderboard: {
          Row: {
            id: string
            full_name: string | null
            avatar_url: string | null
            hustle_level: string
            productivity_score: number
            total_earnings: number
            total_focus_hours: number
            rank: number
          }
        }
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Idea = Database['public']['Tables']['ideas']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type Goal = Database['public']['Tables']['goals']['Row']
export type ChatMessage = Database['public']['Tables']['chat_messages']['Row']
export type FocusSession = Database['public']['Tables']['focus_sessions']['Row']

// New types for additional features
export type Habit = Database['public']['Tables']['habits']['Row']
export type HabitCompletion = Database['public']['Tables']['habit_completions']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']
export type UserAchievement = Database['public']['Tables']['user_achievements']['Row']
export type DailyChallenge = Database['public']['Tables']['daily_challenges']['Row']
export type UserChallenge = Database['public']['Tables']['user_challenges']['Row']
export type WeeklyGoal = Database['public']['Tables']['weekly_goals']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type DailyStats = Database['public']['Tables']['daily_stats']['Row']

export type IdeaStatus = 'backlog' | 'in_progress' | 'review' | 'done'
export type IdeaPriority = 'low' | 'medium' | 'high'
export type TransactionType = 'income' | 'expense'
export type GhostCEOPersona = 'strict' | 'mentor'
export type HabitFrequency = 'daily' | 'weekly' | 'custom'
export type AchievementCategory = 'tasks' | 'finance' | 'habits' | 'streak' | 'social' | 'special'
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type NotificationType = 'reminder' | 'achievement' | 'deadline' | 'briefing' | 'challenge' | 'system'
export type WeeklyGoalType = 'tasks' | 'income' | 'habits' | 'focus_hours' | 'custom'
export type TimeBlock = Database['public']['Tables']['time_blocks']['Row']
export type TimeBlockCategory = 'work' | 'personal' | 'meeting' | 'break' | 'focus' | 'other'

// Hustle levels based on productivity score
export const HUSTLE_LEVELS = [
  { name: 'Newbie Hustler', minScore: 0, maxScore: 199 },
  { name: 'Side Hustler', minScore: 200, maxScore: 499 },
  { name: 'Grinder', minScore: 500, maxScore: 999 },
  { name: 'Boss Mode', minScore: 1000, maxScore: 1999 },
  { name: 'Empire Builder', minScore: 2000, maxScore: Infinity },
] as const

export function getHustleLevel(score: number): string {
  const level = HUSTLE_LEVELS.find(l => score >= l.minScore && score <= l.maxScore)
  return level?.name ?? 'Newbie Hustler'
}

// Achievement definitions (used for seeding and checking)
export const ACHIEVEMENT_DEFINITIONS = [
  // Tasks
  { code: 'first_task', title: 'First Step', description: 'Complete your first task', category: 'tasks', requirement_type: 'tasks_completed', requirement_value: 1, points: 10, rarity: 'common', icon: '🎯' },
  { code: 'task_10', title: 'Getting Started', description: 'Complete 10 tasks', category: 'tasks', requirement_type: 'tasks_completed', requirement_value: 10, points: 25, rarity: 'common', icon: '📝' },
  { code: 'task_50', title: 'Task Master', description: 'Complete 50 tasks', category: 'tasks', requirement_type: 'tasks_completed', requirement_value: 50, points: 50, rarity: 'rare', icon: '⭐' },
  { code: 'task_100', title: 'Centurion', description: 'Complete 100 tasks', category: 'tasks', requirement_type: 'tasks_completed', requirement_value: 100, points: 100, rarity: 'epic', icon: '🏆' },
  { code: 'task_500', title: 'Legendary Hustler', description: 'Complete 500 tasks', category: 'tasks', requirement_type: 'tasks_completed', requirement_value: 500, points: 250, rarity: 'legendary', icon: '👑' },

  // Finance
  { code: 'first_income', title: 'First Dollar', description: 'Record your first income', category: 'finance', requirement_type: 'first_income', requirement_value: 1, points: 15, rarity: 'common', icon: '💵' },
  { code: 'income_1000', title: 'Thousand Club', description: 'Earn $1,000 total', category: 'finance', requirement_type: 'total_income', requirement_value: 1000, points: 50, rarity: 'rare', icon: '💰' },
  { code: 'income_10000', title: 'Five Figure Hustle', description: 'Earn $10,000 total', category: 'finance', requirement_type: 'total_income', requirement_value: 10000, points: 150, rarity: 'epic', icon: '💎' },
  { code: 'income_100000', title: 'Empire Builder', description: 'Earn $100,000 total', category: 'finance', requirement_type: 'total_income', requirement_value: 100000, points: 500, rarity: 'legendary', icon: '🏰' },

  // Habits
  { code: 'first_habit', title: 'Habit Starter', description: 'Complete a habit for the first time', category: 'habits', requirement_type: 'habits_completed', requirement_value: 1, points: 10, rarity: 'common', icon: '🌱' },
  { code: 'habit_7_streak', title: 'Week Warrior', description: 'Maintain a 7-day habit streak', category: 'streak', requirement_type: 'habit_streak', requirement_value: 7, points: 30, rarity: 'common', icon: '🔥' },
  { code: 'habit_30_streak', title: 'Month Master', description: 'Maintain a 30-day habit streak', category: 'streak', requirement_type: 'habit_streak', requirement_value: 30, points: 75, rarity: 'rare', icon: '🔥' },
  { code: 'habit_100_streak', title: 'Consistency King', description: 'Maintain a 100-day habit streak', category: 'streak', requirement_type: 'habit_streak', requirement_value: 100, points: 200, rarity: 'epic', icon: '👑' },
  { code: 'habit_365_streak', title: 'Year of Discipline', description: 'Maintain a 365-day habit streak', category: 'streak', requirement_type: 'habit_streak', requirement_value: 365, points: 500, rarity: 'legendary', icon: '🌟' },

  // Special
  { code: 'early_bird', title: 'Early Bird', description: 'Complete a task before 6 AM', category: 'special', requirement_type: 'early_task', requirement_value: 1, points: 25, rarity: 'rare', icon: '🌅' },
  { code: 'night_owl', title: 'Night Owl', description: 'Complete a task after midnight', category: 'special', requirement_type: 'night_task', requirement_value: 1, points: 25, rarity: 'rare', icon: '🦉' },
  { code: 'weekend_warrior', title: 'Weekend Warrior', description: 'Complete 10 tasks on weekends', category: 'special', requirement_type: 'weekend_tasks', requirement_value: 10, points: 40, rarity: 'rare', icon: '💪' },
] as const
