-- Create push_subscriptions table for storing Web Push subscriptions
-- This enables push notifications across web, PWA, and mobile platforms

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own push subscriptions"
    ON public.push_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push subscriptions"
    ON public.push_subscriptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push subscriptions"
    ON public.push_subscriptions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push subscriptions"
    ON public.push_subscriptions FOR DELETE
    USING (auth.uid() = user_id);

-- Add notification preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS push_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
    "achievements": true,
    "reminders": true,
    "deadlines": true,
    "briefings": true,
    "challenges": true,
    "system": true
}'::jsonb;

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_push_subscription_updated_at ON public.push_subscriptions;
CREATE TRIGGER trigger_update_push_subscription_updated_at
    BEFORE UPDATE ON public.push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_push_subscription_updated_at();

-- Comment on table
COMMENT ON TABLE public.push_subscriptions IS 'Stores Web Push API subscriptions for sending push notifications to users across devices';
