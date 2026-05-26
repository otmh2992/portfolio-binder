import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, locals }) => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
      mode: import.meta.env.MODE,
      baseUrl: import.meta.env.BASE_URL,
      site: import.meta.env.SITE,
    },
    request: {
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      method: request.method,
    },
    runtime: {
      hasRuntime: !!locals?.runtime,
      hasEnv: !!locals?.runtime?.env,
      cfProperties: locals?.runtime?.cf ? {
        colo: locals.runtime.cf.colo,
        country: locals.runtime.cf.country,
        city: locals.runtime.cf.city,
      } : null,
    },
    env_vars: {
      supabase_url: import.meta.env.PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
      supabase_key: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
      cloudflare_account: (locals?.runtime?.env?.CLOUDFLARE_ACCOUNT_ID || import.meta.env.CLOUDFLARE_ACCOUNT_ID) ? '✓ Set' : '✗ Missing',
      r2_access_key: (locals?.runtime?.env?.R2_ACCESS_KEY_ID || import.meta.env.R2_ACCESS_KEY_ID) ? '✓ Set' : '✗ Missing',
      r2_secret_key: (locals?.runtime?.env?.R2_SECRET_ACCESS_KEY || import.meta.env.R2_SECRET_ACCESS_KEY) ? '✓ Set' : '✗ Missing',
      r2_bucket: (locals?.runtime?.env?.R2_BUCKET_NAME || import.meta.env.R2_BUCKET_NAME) ? '✓ Set' : '✗ Missing',
    },
    routes: {
      available: [
        '/api/diagnostic',
        '/api/performance-check',
        '/api/cms/debug',
        '/api/submit-portfolio',
        '/api/upload-video',
        '/api/transloadit-status',
        '/',
        '/signup',
        '/login',
        '/submit',
        '/settings',
        '/admin',
        '/filmmaker/[username]',
      ],
    },
  };

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
