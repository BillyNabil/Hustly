-- =============================================
-- HUSTLY APP DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- Stores user profile information
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    hustle_level TEXT DEFAULT 'Newbie Hustler',
    productivity_score INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    total_focus_hours INTEGER DEFAULT 0,
    ghost_ceo_persona TEXT DEFAULT 'mentor' CHECK (ghost_ceo_persona IN ('strict', 'mentor'))
);

-- =============================================
-- IDEAS TABLE (Kanban Board)
-- Stores user's hustle ideas/tasks
-- =============================================
CREATE TABLE IF NOT EXISTS public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'in_progress', 'review', 'done')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    tags TEXT[] DEFAULT '{}',
    due_date DATE,
    order_index INTEGER DEFAULT 0
);

-- =============================================
-- TRANSACTIONS TABLE (Finance Tracker)
-- Stores income and expenses
-- =============================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12,2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    source TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- =============================================
-- GOALS TABLE (Vision Board)
-- Stores user's financial/life goals
-- =============================================
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    image_url TEXT,
    deadline DATE,
    is_completed BOOLEAN DEFAULT FALSE
);

-- =============================================
-- CHAT MESSAGES TABLE (Ghost CEO Chat)
-- Stores chat history with AI
-- =============================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL
);

-- =============================================
-- FOCUS SESSIONS TABLE
-- Stores pomodoro/focus session data
-- =============================================
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Users can only access their own data
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view own ideas" ON public.ideas
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ideas" ON public.ideas
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ideas" ON public.ideas
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ideas" ON public.ideas
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.goals
    FOR DELETE USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat messages" ON public.chat_messages
    FOR DELETE USING (auth.uid() = user_id);

-- Focus sessions policies
CREATE POLICY "Users can view own focus sessions" ON public.focus_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own focus sessions" ON public.focus_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- LEADERBOARD VIEW (Public - read only)
-- Shows top hustlers for leaderboard
-- =============================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    id,
    full_name,
    avatar_url,
    hustle_level,
    productivity_score,
    total_earnings,
    total_focus_hours,
    ROW_NUMBER() OVER (ORDER BY productivity_score DESC) as rank
FROM public.profiles
WHERE productivity_score > 0
ORDER BY productivity_score DESC
LIMIT 100;

-- Allow all authenticated users to view leaderboard
CREATE POLICY "Anyone can view leaderboard" ON public.profiles
    FOR SELECT USING (true);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_ideas_updated_at
    BEFORE UPDATE ON public.ideas
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_productivity ON public.profiles(productivity_score DESC);
