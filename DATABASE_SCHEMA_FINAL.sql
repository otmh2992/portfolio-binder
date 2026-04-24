
-- =====================================================
-- PORTFOLIO BINDER - FINAL DATABASE SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor
-- Go to: Supabase Dashboard → SQL Editor → New Query

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
-- Username format: [4-digit-code]-[film-slug]
-- Examples: 2947-inception, 5031-parasite, 8472-casablanca

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Authentication & Identity
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,  -- Format: ####-film-slug (e.g., 2947-inception)
  full_name TEXT NOT NULL,
  film_title TEXT,  -- The film name they selected (e.g., "Inception")
  
  -- Profile
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  
  -- Role & Status
  role TEXT DEFAULT 'filmmaker' CHECK (role IN ('filmmaker', 'producer', 'viewer', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  
  -- Social Links
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  vimeo TEXT,
  
  -- Metadata
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_film_title ON users(film_title);

-- =====================================================
-- 2. PORTFOLIOS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Owner
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  
  -- Media
  video_url TEXT,
  thumbnail_url TEXT,
  duration INTEGER, -- in seconds
  
  -- Metadata
  tags TEXT[],
  category TEXT,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Indexes for portfolios table
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON portfolios(featured);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON portfolios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolios_category ON portfolios(category);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_portfolios_user_status ON portfolios(user_id, status);

-- GIN index for tags array
CREATE INDEX IF NOT EXISTS idx_portfolios_tags ON portfolios USING GIN(tags);

-- =====================================================
-- 3. SAMPLE DATA (Updated with new username format)
-- =====================================================

-- Insert sample users with film-based usernames
INSERT INTO users (email, username, full_name, film_title, bio, role, avatar_url, location)
VALUES
  (
    'alex@example.com',
    '2947-inception',
    'Alex Rivera',
    'Inception',
    'Independent filmmaker specializing in documentary and short films.',
    'filmmaker',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2947-inception',
    'Los Angeles, CA'
  ),
  (
    'jordan@example.com',
    '5031-parasite',
    'Jordan Lee',
    'Parasite',
    'Cinematographer and director with a passion for visual storytelling.',
    'filmmaker',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=5031-parasite',
    'New York, NY'
  ),
  (
    'sam@example.com',
    '7264-bladerunner',
    'Sam Chen',
    'Blade Runner',
    'Award-winning editor and filmmaker focused on narrative storytelling.',
    'filmmaker',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=7264-bladerunner',
    'Austin, TX'
  )
ON CONFLICT (email) DO NOTHING;

-- Insert sample portfolios
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM users WHERE username = '2947-inception';
  SELECT id INTO user2_id FROM users WHERE username = '5031-parasite';
  SELECT id INTO user3_id FROM users WHERE username = '7264-bladerunner';
  
  -- Insert portfolios for user 1 (2947-inception)
  IF user1_id IS NOT NULL THEN
    INSERT INTO portfolios (user_id, title, description, thumbnail_url, tags, featured, category)
    VALUES
      (
        user1_id,
        'Sunset Boulevard Documentary',
        'A powerful documentary exploring the lives of street artists in LA.',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800',
        ARRAY['documentary', 'street art', 'los angeles'],
        true,
        'Documentary'
      ),
      (
        user1_id,
        'Urban Stories',
        'Short film series capturing everyday moments in the city.',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
        ARRAY['short film', 'urban', 'narrative'],
        true,
        'Short Film'
      );
  END IF;
  
  -- Insert portfolios for user 2 (5031-parasite)
  IF user2_id IS NOT NULL THEN
    INSERT INTO portfolios (user_id, title, description, thumbnail_url, tags, featured, category)
    VALUES
      (
        user2_id,
        'Neon Dreams',
        'Experimental visual piece exploring light and color in urban environments.',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800',
        ARRAY['experimental', 'cinematography', 'visual'],
        true,
        'Experimental'
      ),
      (
        user2_id,
        'Portrait Series: NYC',
        'Character-driven portraits of New York City residents.',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
        ARRAY['portrait', 'documentary', 'new york'],
        false,
        'Documentary'
      ),
      (
        user2_id,
        'Commercial Reel 2024',
        'Collection of recent commercial work for brands.',
        'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=800',
        ARRAY['commercial', 'advertising', 'reel'],
        true,
        'Commercial'
      );
  END IF;
  
  -- Insert portfolios for user 3 (7264-bladerunner)
  IF user3_id IS NOT NULL THEN
    INSERT INTO portfolios (user_id, title, description, thumbnail_url, tags, featured, category)
    VALUES
      (
        user3_id,
        'The Last Train',
        'Award-winning short film about connection and loss.',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
        ARRAY['short film', 'narrative', 'drama'],
        true,
        'Short Film'
      ),
      (
        user3_id,
        'Music Video: Electric Dreams',
        'High-energy music video with innovative editing techniques.',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        ARRAY['music video', 'editing', 'experimental'],
        false,
        'Music Video'
      ),
      (
        user3_id,
        'Austin Film Festival 2023',
        'Behind-the-scenes coverage of the film festival.',
        'https://images.unsplash.com/photo-1574267432644-f61e7c808119?w=800',
        ARRAY['festival', 'documentary', 'bts'],
        false,
        'Documentary'
      );
  END IF;
END $$;

-- =====================================================
-- 4. FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for portfolios table
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON portfolios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW LEVEL SECURITY (Disabled for now)
-- =====================================================

-- Uncomment these when you add authentication:

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Public users are viewable by everyone"
--   ON users FOR SELECT USING (true);

-- CREATE POLICY "Published portfolios are viewable by everyone"
--   ON portfolios FOR SELECT USING (status = 'published');

-- =====================================================
-- DONE! 
-- =====================================================
-- Your database is ready with:
-- ✅ Film-based usernames (e.g., 2947-inception)
-- ✅ No age collection (mysterious filmmaker identities)
-- ✅ Sample data with 3 filmmakers
-- ✅ Auto-generated 4-digit codes
-- ✅ Optimized indexes
-- 
-- Next: Test the username selector animation! 🎬

