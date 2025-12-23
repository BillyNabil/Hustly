-- Time Blocking Migration
-- Creates table for time blocking feature

-- Create time_blocks table
CREATE TABLE IF NOT EXISTS public.time_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    color TEXT DEFAULT '#F5A623',
    category TEXT DEFAULT 'work',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly', or cron expression
    reminder_minutes INTEGER DEFAULT 15, -- Minutes before to send reminder
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    linked_task_id UUID REFERENCES public.ideas(id) ON DELETE SET NULL,
    notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_time_blocks_user_id ON public.time_blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_time_blocks_start_time ON public.time_blocks(start_time);
CREATE INDEX IF NOT EXISTS idx_time_blocks_user_date ON public.time_blocks(user_id, start_time);

-- Enable RLS
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own time blocks" ON public.time_blocks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time blocks" ON public.time_blocks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time blocks" ON public.time_blocks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time blocks" ON public.time_blocks
    FOR DELETE USING (auth.uid() = user_id);

-- Add 'timeblock' notification type to the notifications type if needed
-- (We'll handle this in application code since the type is already flexible)

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_time_blocks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS time_blocks_updated_at ON public.time_blocks;
CREATE TRIGGER time_blocks_updated_at
    BEFORE UPDATE ON public.time_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_time_blocks_updated_at();
