-- Create daily_challenges table if not exists
CREATE TABLE IF NOT EXISTS public.daily_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    date DATE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    challenge_type TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    points_reward INTEGER DEFAULT 50,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create user_challenges table if not exists
CREATE TABLE IF NOT EXISTS public.user_challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
    current_progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON public.daily_challenges(date);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON public.user_challenges(challenge_id);

-- Ensure unique constraint to prevent duplicate challenges for same title/date
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_challenges_date_title ON public.daily_challenges(date, title);

-- Enable RLS
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- Policies for daily_challenges
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view daily challenges" ON public.daily_challenges;
DROP POLICY IF EXISTS "Authenticated users can create daily challenges" ON public.daily_challenges;

-- Everyone can view challenges
CREATE POLICY "Anyone can view daily challenges" ON public.daily_challenges
    FOR SELECT USING (true);

-- Authenticated users can insert daily challenges (needed for client-side generation)
CREATE POLICY "Authenticated users can create daily challenges" ON public.daily_challenges
    FOR INSERT TO authenticated WITH CHECK (true);

-- Policies for user_challenges
DROP POLICY IF EXISTS "Users can view own challenge progress" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can create own challenge progress" ON public.user_challenges;
DROP POLICY IF EXISTS "Users can update own challenge progress" ON public.user_challenges;

CREATE POLICY "Users can view own challenge progress" ON public.user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own challenge progress" ON public.user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenge progress" ON public.user_challenges
    FOR UPDATE USING (auth.uid() = user_id);
