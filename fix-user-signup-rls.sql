-- =====================================================
-- FIX: Allow New User Signup
-- =====================================================
-- Run this in Supabase SQL Editor to fix the RLS error
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste this

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;

-- Policy 1: Allow anyone to view user profiles (public read)
CREATE POLICY "Public users are viewable by everyone"
  ON users FOR SELECT
  USING (true);

-- Policy 2: Allow new users to insert their own data during signup
-- This is the KEY policy that fixes the signup error
CREATE POLICY "Enable insert for authenticated users only"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- DONE! Users can now sign up successfully
-- =====================================================
