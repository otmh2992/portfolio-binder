-- =====================================================
-- SIMPLE MIGRATION SCRIPT - UPDATES EXISTING DATABASE
-- =====================================================
-- ⚠️ IMPORTANT: Close all other SQL tabs before running!
-- Run this in a NEW, CLEAN tab in Supabase SQL Editor

-- =====================================================
-- STEP 1: CREATE USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  role TEXT DEFAULT 'filmmaker',
  is_verified BOOLEAN DEFAULT false,
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  vimeo TEXT,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =====================================================
-- STEP 2: ADD NEW COLUMNS TO PORTFOLIOS TABLE
-- =====================================================

-- Add user_id column
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS user_id UUID;

-- Add/rename title column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'title') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'name') THEN
      ALTER TABLE portfolios RENAME COLUMN name TO title;
    ELSE
      ALTER TABLE portfolios ADD COLUMN title TEXT;
    END IF;
  END IF;
END $$;

-- Add video_url column
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Add/rename thumbnail_url column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'thumbnail_url') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'portfolios' AND column_name = 'image_url') THEN
      ALTER TABLE portfolios RENAME COLUMN image_url TO thumbnail_url;
    ELSE
      ALTER TABLE portfolios ADD COLUMN thumbnail_url TEXT;
    END IF;
  END IF;
END $$;

-- Add other columns
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS duration INTEGER;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ⚠️ NOTE: We're NOT adding the "status" column to avoid conflicts
-- The app doesn't require it - it will work without it

-- =====================================================
-- STEP 3: INSERT SAMPLE USERS
-- =====================================================
INSERT INTO users (email, username, full_name, bio, role, avatar_url, location)
VALUES
  ('filmmaker1@example.com', 'filmmaker1', 'Alex Rivera', 'Independent filmmaker specializing in documentary and short films.', 'filmmaker', 'https://api.dicebear.com/7.x/avataaars/svg?seed=filmmaker1', 'Los Angeles, CA'),
  ('filmmaker2@example.com', 'filmmaker2', 'Jordan Lee', 'Cinematographer and director with a passion for visual storytelling.', 'filmmaker', 'https://api.dicebear.com/7.x/avataaars/svg?seed=filmmaker2', 'New York, NY'),
  ('filmmaker3@example.com', 'filmmaker3', 'Sam Chen', 'Award-winning editor and filmmaker focused on narrative storytelling.', 'filmmaker', 'https://api.dicebear.com/7.x/avataaars/svg?seed=filmmaker3', 'Austin, TX')
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- STEP 4: LINK EXISTING PORTFOLIOS TO USERS
-- =====================================================
DO $$
DECLARE
  user_ids UUID[] := ARRAY(SELECT id FROM users ORDER BY created_at LIMIT 3);
  portfolio_record RECORD;
  user_index INTEGER := 0;
BEGIN
  -- Loop through portfolios that don't have a user_id
  FOR portfolio_record IN 
    SELECT id FROM portfolios WHERE user_id IS NULL ORDER BY created_at
  LOOP
    -- Assign to user in round-robin fashion
    UPDATE portfolios 
    SET user_id = user_ids[(user_index % 3) + 1]
    WHERE id = portfolio_record.id;
    
    user_index := user_index + 1;
  END LOOP;
END $$;

-- =====================================================
-- STEP 5: ADD INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);

-- =====================================================
-- STEP 6: VERIFY RESULTS
-- =====================================================
SELECT '✅ Migration Complete!' as status;

SELECT 'Users created:' as info, COUNT(*)::text as count FROM users
UNION ALL
SELECT 'Portfolios with users:', COUNT(*)::text FROM portfolios WHERE user_id IS NOT NULL
UNION ALL
SELECT 'Portfolios without users:', COUNT(*)::text FROM portfolios WHERE user_id IS NULL;

-- Show portfolio distribution
SELECT 
  u.username,
  u.full_name,
  COUNT(p.id) as portfolio_count
FROM users u
LEFT JOIN portfolios p ON u.id = p.user_id
GROUP BY u.username, u.full_name
ORDER BY portfolio_count DESC;
