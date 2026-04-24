-- =====================================================
-- PHASE 1: COMPLETE DATABASE SCHEMA
-- Filmmaker Portfolio + User Profiles + Crowdfunding
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- Stores user/filmmaker profiles
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Auth & Identity
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  
  -- Profile Info
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  location TEXT,
  website TEXT,
  
  -- Social Links
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  vimeo TEXT,
  
  -- Role & Status
  role TEXT DEFAULT 'filmmaker' CHECK (role IN ('filmmaker', 'backer', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  
  -- Stats (calculated fields)
  total_projects INTEGER DEFAULT 0,
  total_backed INTEGER DEFAULT 0,
  total_raised DECIMAL(10,2) DEFAULT 0.00,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- 2. PORTFOLIOS TABLE
-- Individual portfolio items (films, projects, work samples)
-- =====================================================
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Owner
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  
  -- Media
  thumbnail_url TEXT,
  video_url TEXT,
  images TEXT[], -- Array of image URLs
  
  -- Metadata
  category TEXT, -- 'short-film', 'documentary', 'music-video', etc.
  tags TEXT[],
  year INTEGER,
  duration INTEGER, -- in minutes
  
  -- Display
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Additional data
  credits JSONB DEFAULT '{}'::jsonb, -- {director: '', producer: '', etc}
  awards JSONB DEFAULT '[]'::jsonb, -- [{name: '', year: '', category: ''}]
  
  UNIQUE(user_id, slug)
);

-- =====================================================
-- 3. CAMPAIGNS TABLE
-- Crowdfunding campaigns for projects
-- =====================================================
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Owner
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL, -- Optional link to portfolio
  
  -- Campaign Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT, -- Short pitch
  description TEXT, -- Full description (markdown supported)
  story TEXT, -- The detailed story/pitch
  
  -- Media
  cover_image_url TEXT,
  video_url TEXT,
  gallery_images TEXT[],
  
  -- Funding
  goal_amount DECIMAL(10,2) NOT NULL,
  current_amount DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'USD',
  
  -- Timeline
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'successful', 'failed', 'cancelled')),
  
  -- Stats
  backer_count INTEGER DEFAULT 0,
  
  -- Settings
  is_flexible BOOLEAN DEFAULT false, -- Keep funds even if goal not reached
  
  -- Metadata
  category TEXT,
  tags TEXT[],
  risks_and_challenges TEXT,
  faqs JSONB DEFAULT '[]'::jsonb
);

-- =====================================================
-- 4. PLEDGE_TIERS TABLE
-- Reward tiers for campaigns (e.g., $25, $100, $500)
-- =====================================================
CREATE TABLE IF NOT EXISTS pledge_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Campaign
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  
  -- Tier Info
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  
  -- Rewards
  rewards TEXT[], -- ["Digital download", "Producer credit"]
  estimated_delivery TEXT, -- "June 2025"
  
  -- Limits
  limited_quantity INTEGER, -- NULL = unlimited
  backers_count INTEGER DEFAULT 0,
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true
);

-- =====================================================
-- 5. PLEDGES TABLE
-- Individual pledges/contributions from backers
-- =====================================================
CREATE TABLE IF NOT EXISTS pledges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Parties
  backer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  tier_id UUID REFERENCES pledge_tiers(id) ON DELETE SET NULL,
  
  -- Backer Info (for non-logged-in backers)
  backer_email TEXT,
  backer_name TEXT,
  
  -- Payment
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Stripe Integration
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Metadata
  is_anonymous BOOLEAN DEFAULT false,
  message TEXT, -- Optional message to creator
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- 6. UPDATES TABLE
-- Campaign updates/news from creators
-- =====================================================
CREATE TABLE IF NOT EXISTS campaign_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Campaign
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  
  -- Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- Visibility
  is_backers_only BOOLEAN DEFAULT false
);

-- =====================================================
-- 7. COMMENTS TABLE
-- Comments on campaigns/portfolios
-- =====================================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Author
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  -- Target (can comment on campaign OR portfolio)
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  
  -- Nested replies
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Moderation
  is_deleted BOOLEAN DEFAULT false,
  
  CHECK (
    (campaign_id IS NOT NULL AND portfolio_id IS NULL) OR
    (campaign_id IS NULL AND portfolio_id IS NOT NULL)
  )
);

-- =====================================================
-- 8. FOLLOWS TABLE
-- Users following other users
-- =====================================================
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Portfolios
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_featured ON portfolios(featured);
CREATE INDEX idx_portfolios_category ON portfolios(category);

-- Campaigns
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_slug ON campaigns(slug);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_end_date ON campaigns(end_date);

-- Pledge Tiers
CREATE INDEX idx_pledge_tiers_campaign_id ON pledge_tiers(campaign_id);

-- Pledges
CREATE INDEX idx_pledges_backer_id ON pledges(backer_id);
CREATE INDEX idx_pledges_campaign_id ON pledges(campaign_id);
CREATE INDEX idx_pledges_status ON pledges(status);

-- Comments
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_campaign_id ON comments(campaign_id);
CREATE INDEX idx_comments_portfolio_id ON comments(portfolio_id);

-- Follows
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update campaign current_amount when pledge is created
CREATE OR REPLACE FUNCTION update_campaign_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE campaigns 
    SET 
      current_amount = current_amount + NEW.amount,
      backer_count = backer_count + 1
    WHERE id = NEW.campaign_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaign_on_pledge AFTER INSERT ON pledges
  FOR EACH ROW EXECUTE FUNCTION update_campaign_amount();

-- =====================================================
-- SAMPLE DATA FOR DEMO
-- =====================================================

-- Insert demo filmmaker
INSERT INTO users (email, username, full_name, bio, avatar_url, role, is_verified)
VALUES (
  'demo@filmmaker.com',
  'johndoe',
  'John Doe',
  'Award-winning documentary filmmaker specializing in environmental and social justice stories. 10+ years experience in film production.',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  'filmmaker',
  true
) ON CONFLICT (email) DO NOTHING
RETURNING id;

-- Note: You'll need to get the user ID from above to insert related data
-- For now, this gives you the structure. We'll add more sample data via the admin panel.

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- Disabled for now - we'll enable later with Memberstack
-- =====================================================

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Example policies (commented out for now):
-- CREATE POLICY "Users can view all profiles" ON users FOR SELECT TO anon, authenticated USING (true);
-- CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- =====================================================
-- NOTES
-- =====================================================
-- 
-- This schema supports:
-- ✅ User profiles with social links
-- ✅ Portfolio items (films/projects)
-- ✅ Crowdfunding campaigns
-- ✅ Pledge tiers and rewards
-- ✅ Payment tracking (Stripe integration ready)
-- ✅ Comments on campaigns/portfolios
-- ✅ User follows
-- ✅ Campaign updates
-- 
-- Next steps:
-- 1. Run this in Supabase SQL Editor
-- 2. Create TypeScript types for these tables
-- 3. Build UI components for each feature
--