import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bwwymftwqzegwuosjkqh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3d3ltZnR3cXplZ3d1b3Nqa3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjY4NTksImV4cCI6MjA4MTgwMjg1OX0.hPx2yopjPHnxzgpC6S8ugCK7gi3aHp40B9QXwc8GvaE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

// Cached user ID to avoid repeated getUser() calls
let cachedUserId: string | null = null;

export async function getCachedUserId(): Promise<string | null> {
    if (cachedUserId) return cachedUserId;

    try {
        const { data } = await supabase.auth.getSession();
        cachedUserId = data.session?.user?.id || null;
        return cachedUserId;
    } catch (e) {
        console.warn('Failed to get cached user ID:', e);
        return null;
    }
}

export function setCachedUserId(id: string | null) {
    cachedUserId = id;
}

// Clear cache on logout
export function clearUserCache() {
    cachedUserId = null;
}

