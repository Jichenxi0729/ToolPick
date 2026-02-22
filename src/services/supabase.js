import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://iavquwkarbobprsxpqgd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdnF1d2thcmJvYnByc3hwcWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MzY0MjgsImV4cCI6MjA4NzIxMjQyOH0.GYADeWEI_iGqynN9tHGiKQZHxcmF8tfd1V-ToXsvOCc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
