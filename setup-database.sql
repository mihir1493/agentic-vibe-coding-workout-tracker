-- Workout Tracker Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for public access
-- Users table policies
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can be inserted by everyone" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can be deleted by everyone" ON users
  FOR DELETE USING (true);

-- Workouts table policies
CREATE POLICY "Workouts are viewable by everyone" ON workouts
  FOR SELECT USING (true);

CREATE POLICY "Workouts can be inserted by everyone" ON workouts
  FOR INSERT WITH CHECK (true);

-- 5. Verify tables were created
SELECT 'Users table:' as info, count(*) as count FROM users
UNION ALL
SELECT 'Workouts table:', count(*) FROM workouts; 