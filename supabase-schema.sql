-- Portfolio Table Schema
-- Copy and paste this into Supabase SQL Editor for instant setup!
-- Go to: Supabase Dashboard → SQL Editor → New Query

-- Create the portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  image_alt TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0
);

-- Create an index on the order column for faster sorting
CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio("order");

-- Create an index on the featured column for faster filtering
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio(featured);

-- Create an index on the slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_portfolio_slug ON portfolio(slug);

-- Insert some sample data (optional - remove if you don't want test data)
INSERT INTO portfolio (name, slug, description, image_url, image_alt, tags, featured, "order")
VALUES
  (
    'Abstract Art Collection',
    'abstract-art-collection',
    'A modern collection of abstract digital artwork exploring color and form.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    'Colorful abstract art',
    ARRAY['art', 'design', 'digital'],
    true,
    1
  ),
  (
    'Minimalist Portfolio',
    'minimalist-portfolio',
    'Clean and simple portfolio design showcasing photography work.',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800',
    'Minimalist design',
    ARRAY['photography', 'minimal', 'portfolio'],
    true,
    2
  ),
  (
    'Brand Identity Project',
    'brand-identity-project',
    'Complete brand identity system including logo, colors, and typography.',
    'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800',
    'Brand identity mockup',
    ARRAY['branding', 'logo', 'identity'],
    false,
    3
  ),
  (
    'Web Design Showcase',
    'web-design-showcase',
    'Modern web design featuring bold typography and interactive elements.',
    'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800',
    'Web design mockup',
    ARRAY['web', 'design', 'ui'],
    true,
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (we'll keep it disabled for now for simplicity)
-- Uncomment these lines when you're ready to add authentication
-- ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
-- CREATE POLICY "Allow public read access" ON portfolio
--   FOR SELECT TO anon USING (true);

-- Comment: For now, we're keeping RLS disabled so the public can view your portfolio
-- When you're ready to add admin authentication, we'll enable RLS and add policies
