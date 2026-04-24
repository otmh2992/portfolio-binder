-- Performance Optimization for Portfolio Database
-- Run this in Supabase SQL Editor to speed up queries

-- 1. Index on created_at for sorting (most common query)
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at 
ON portfolios(created_at DESC);

-- 2. Index on featured flag for filtering
CREATE INDEX IF NOT EXISTS idx_portfolios_featured 
ON portfolios(featured) 
WHERE featured = true;

-- 3. Composite index for common query pattern (featured + created_at)
CREATE INDEX IF NOT EXISTS idx_portfolios_featured_created 
ON portfolios(featured, created_at DESC);

-- 4. Index for user portfolios (if you add user filtering later)
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id 
ON portfolios(user_id);

-- 5. Analyze table to update query planner statistics
ANALYZE portfolios;

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'portfolios'
ORDER BY indexname;
