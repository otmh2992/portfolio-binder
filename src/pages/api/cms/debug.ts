import type { APIRoute } from 'astro';
import { listCollections } from '../../../lib/cms';

/**
 * Debug endpoint to check CMS configuration and list available collections
 */
export const GET: APIRoute = async ({ locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
  const siteId = locals?.runtime?.env?.WEBFLOW_SITE_ID || import.meta.env.WEBFLOW_SITE_ID;
  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || import.meta.env.WEBFLOW_API_HOST;

  const debug = {
    configuration: {
      hasToken: !!token,
      hasSiteId: !!siteId,
      hasCustomApiHost: !!baseUrl,
      apiHost: baseUrl || 'https://api.webflow.com'
    },
    collections: [] as any[],
    error: null as string | null
  };

  if (!token) {
    debug.error = 'WEBFLOW_CMS_SITE_API_TOKEN is not configured';
    return new Response(JSON.stringify(debug, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!siteId) {
    debug.error = 'WEBFLOW_SITE_ID is not configured';
    return new Response(JSON.stringify(debug, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    debug.collections = await listCollections(locals);
    
    if (debug.collections.length === 0) {
      debug.error = 'No CMS collections found for this site. Create a collection in Webflow first.';
    }
  } catch (error: any) {
    debug.error = error.message || 'Failed to fetch collections';
  }

  return new Response(JSON.stringify(debug, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
