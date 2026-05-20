import { createClient } from '@supabase/supabase-js';

// These are injected at BUILD TIME by Astro + Cloudflare Pages
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY!;

// Safety check (will fail build if missing)
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in environment variables'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);