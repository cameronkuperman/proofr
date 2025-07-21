import { createClient } from '@supabase/supabase-js'

// For React Native/Expo, we need to hardcode these values
// In production, use expo-constants or react-native-config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nufvqhbokuqbbriktiys.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZnZxaGJva3VxYmJyaWt0aXlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzAwOTAsImV4cCI6MjA2NTE0NjA5MH0.9f2ntkxKvLuG3bgJQXVUBoxI9tDRREYr1lQ7Uu3EODk'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)