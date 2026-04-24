import type { APIRoute } from 'astro';
import { WebflowClient } from 'webflow-api';

export const GET: APIRoute = async ({ params, locals }) => {
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

  const { collectionId, itemId } = params;
  if (!collectionId || !itemId) {
    return new Response(JSON.stringify({ error: 'Collection ID and Item ID are required' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const item = await client.collections.items.getItemLive(collectionId, itemId);
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching CMS item:', error);
    return new Response(JSON.stringify({ 
      error: 'Item not found',
      details: error.message 
    }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
