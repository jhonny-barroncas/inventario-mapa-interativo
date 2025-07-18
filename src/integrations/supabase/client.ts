import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svxrfsmoyhkhurxwsohz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2eHJmc21veWhraHVyeHdzb2h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTc0MjAsImV4cCI6MjA2ODI5MzQyMH0.E8f9pWWz8lztbNc3zaS77TmixSEFNWnNnSOeJXPyr_A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)