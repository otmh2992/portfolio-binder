import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    const supabaseUrl =
      locals?.runtime?.env?.SUPABASE_URL || import.meta.env.SUPABASE_URL;

    const supabaseAnonKey =
      locals?.runtime?.env?.SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(JSON.stringify({ message: 'Missing Supabase configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authToken = cookies.get('sb-access-token')?.value;

    if (!authToken) {
      return new Response(JSON.stringify({ message: 'Unauthorized. Please log in.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    });

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();

    if (authError || !session) {
      return new Response(JSON.stringify({ message: 'Invalid authentication' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = session.user;

    const { title, description, category, video_url, thumbnail_url, slug } =
      await request.json();

    if (!title || !category || !slug) {
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        category,
        video_url: video_url || null,
        thumbnail_url: thumbnail_url || null,
        slug,
        featured: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);

      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Submit portfolio error:', error);

    return new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : 'Failed to save portfolio',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};