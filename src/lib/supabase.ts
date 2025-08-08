import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if environment variables are properly set
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase environment variables not set. Please add them to your .env.local file.')
  console.warn('URL:', supabaseUrl)
  console.warn('Key:', supabaseAnonKey ? 'Set' : 'Not set')
}

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export type User = {
  id: string
  name: string
  age: number
  created_at: string
}

export type Workout = {
  id: string
  user_id: string
  completed: boolean
  created_at: string
} 