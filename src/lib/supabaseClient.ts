import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bwwymftwqzegwuosjkqh.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3d3ltZnR3cXplZ3d1b3Nqa3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjY4NTksImV4cCI6MjA4MTgwMjg1OX0.hPx2yopjPHnxzgpC6S8ugCK7gi3aHp40B9QXwc8GvaE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
