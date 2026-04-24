-- =====================================================
-- FIX: Make full_name nullable in users table
-- =====================================================
-- Run this in Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste this

-- Make full_name nullable (users can add it later in settings)
ALTER TABLE users 
ALTER COLUMN full_name DROP NOT NULL;

-- =====================================================
-- DONE! Users can now sign up without a full name
-- =====================================================
