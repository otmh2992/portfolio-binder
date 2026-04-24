import type { APIRoute } from 'astro';
import { WebflowClient } from 'webflow-api';

export const GET: APIRoute = async ({ params, request, locals }) => {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing CMS API token' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || import.meta.env.WEBFLOW_API_HOST;
  const client = new WebflowClient({
    accessToken: token,
    ...(baseUrl && { baseUrl })
  });

  const { collectionId } = params;
  if (!collectionId) {
    return new Response(JSON.stringify({ error: 'Collection ID is required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 100), 100);
  const offset = Number(url.searchParams.get('offset') ?? 0);

  try {
    const res = await client.collections.items.listItemsLive(collectionId, {
      limit,
      offset
    });
    
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching CMS items:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch CMS items',
      details: error.message 
    }), { 
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
