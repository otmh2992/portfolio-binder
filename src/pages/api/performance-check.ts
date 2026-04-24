import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ locals }) => {
  const timings: Record<string, number> = {};
  const results: Record<string, any> = {};
  
  // Test 1: Supabase connection
  const supabaseStart = Date.now();
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('id, title, thumbnail_url')
      .limit(1);
    
    timings.supabase = Date.now() - supabaseStart;
    results.supabase = {
      success: !error,
      error: error?.message,
      itemCount: data?.length || 0,
    };
  } catch (err: any) {
    timings.supabase = Date.now() - supabaseStart;
    results.supabase = {
      success: false,
      error: err.message,
    };
  }

  // Test 2: Full query (what the app actually does)
  const fullQueryStart = Date.now();
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .order('created_at', { ascending: false });
    
    timings.fullQuery = Date.now() - fullQueryStart;
    results.fullQuery = {
      success: !error,
      error: error?.message,
      itemCount: data?.length || 0,
      totalDataSize: JSON.stringify(data).length,
    };
  } catch (err: any) {
    timings.fullQuery = Date.now() - fullQueryStart;
    results.fullQuery = {
      success: false,
      error: err.message,
    };
  }

  // Test 3: Environment variables
  const envVars = {
    SUPABASE_URL: !!import.meta.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!import.meta.env.SUPABASE_ANON_KEY,
    cloudflareEnv: {
      SUPABASE_URL: !!(locals?.runtime?.env?.SUPABASE_URL),
      SUPABASE_ANON_KEY: !!(locals?.runtime?.env?.SUPABASE_ANON_KEY),
    }
  };

  return new Response(JSON.stringify({
    status: 'Performance diagnostics',
    timestamp: new Date().toISOString(),
    timings: {
      ...timings,
      total: Object.values(timings).reduce((a, b) => a + b, 0),
    },
    results,
    environment: envVars,
    performance: {
      supabaseSpeed: timings.supabase < 200 ? 'GOOD' : timings.supabase < 500 ? 'OK' : 'SLOW',
      fullQuerySpeed: timings.fullQuery < 500 ? 'GOOD' : timings.fullQuery < 1000 ? 'OK' : 'SLOW',
    },
    recommendations: [
      timings.supabase > 500 ? 'Supabase query is slow - check database indexes' : null,
      timings.fullQuery > 1000 ? 'Full query is slow - consider pagination or limiting results' : null,
      results.fullQuery?.totalDataSize > 50000 ? 'Data payload is large - consider reducing fields or adding pagination' : null,
    ].filter(Boolean),
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  });
};
