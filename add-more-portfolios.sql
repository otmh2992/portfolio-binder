-- STEP 1: First, find your real user_id by running this:
-- SELECT id, email FROM auth.users LIMIT 5;

-- STEP 2: Copy your actual user_id from the result above
-- STEP 3: Replace 'YOUR_USER_ID_HERE' below with your real ID
-- STEP 4: Run the INSERT statement

-- Add 5 more portfolio items to Supabase
INSERT INTO portfolios (
  user_id,
  title,
  description,
  thumbnail_url,
  video_url,
  category,
  featured,
  slug
) VALUES
(
  'YOUR_USER_ID_HERE', -- ← REPLACE THIS with your actual user_id
  'Urban Stories',
  'A documentary exploring street art and culture in metropolitan cities.',
  'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800&q=80',
  NULL,
  'documentary',
  true,
  'urban-stories'
),
(
  'YOUR_USER_ID_HERE', -- ← REPLACE THIS
  'Silent Echo',
  'An experimental piece exploring sound design and visual poetry.',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
  NULL,
  'experimental',
  false,
  'silent-echo'
),
(
  'YOUR_USER_ID_HERE', -- ← REPLACE THIS
  'Golden Hour',
  'A cinematic short film about connection and nostalgia during sunset.',
  'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&q=80',
  NULL,
  'short-film',
  true,
  'golden-hour'
),
(
  'YOUR_USER_ID_HERE', -- ← REPLACE THIS
  'Neon Nights',
  'A music video showcasing cyberpunk aesthetics and electronic beats.',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  NULL,
  'music-video',
  false,
  'neon-nights'
),
(
  'YOUR_USER_ID_HERE', -- ← REPLACE THIS
  'Forest Whispers',
  'A nature documentary capturing the hidden life of ancient woodlands.',
  'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
  NULL,
  'documentary',
  true,
  'forest-whispers'
);
