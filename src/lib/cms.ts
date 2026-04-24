import { WebflowClient } from 'webflow-api';

export interface CmsCollection {
  id: string;
  displayName?: string;
  singularName?: string;
  slug: string;
}

/**
 * Get the Webflow client instance
 * This should only be called on the server
 */
export function getWebflowClient(locals?: any) {
  const token = locals?.runtime?.env?.WEBFLOW_CMS_SITE_API_TOKEN || import.meta.env.WEBFLOW_CMS_SITE_API_TOKEN;
  if (!token) {
    throw new Error('Missing WEBFLOW_CMS_SITE_API_TOKEN');
  }

  const baseUrl = locals?.runtime?.env?.WEBFLOW_API_HOST || import.meta.env.WEBFLOW_API_HOST;
  const siteId = locals?.runtime?.env?.WEBFLOW_SITE_ID || import.meta.env.WEBFLOW_SITE_ID;

  return {
    client: new WebflowClient({
      accessToken: token,
      ...(baseUrl && { baseUrl })
    }),
    siteId
  };
}

/**
 * List all CMS collections for the site
 */
export async function listCollections(locals?: any): Promise<CmsCollection[]> {
  try {
    const { client, siteId } = getWebflowClient(locals);
    
    if (!siteId) {
      console.warn('WEBFLOW_SITE_ID not configured');
      return [];
    }

    const response = await client.collections.list(siteId);
    return (response.collections || []) as CmsCollection[];
  } catch (error) {
    console.error('Error listing collections:', error);
    return [];
  }
}

/**
 * Find a collection by name or slug
 */
export async function findCollection(nameOrSlug: string, locals?: any): Promise<CmsCollection | null> {
  const collections = await listCollections(locals);
  const search = nameOrSlug.toLowerCase();
  
  return collections.find(
    col => (col.displayName?.toLowerCase() === search || 
            col.singularName?.toLowerCase() === search ||
            col.slug.toLowerCase() === search)
  ) || null;
}

/**
 * Get live items from a collection
 */
export async function getCollectionItems(collectionId: string, locals?: any, limit = 100) {
  try {
    const { client } = getWebflowClient(locals);
    
    const response = await client.collections.items.listItemsLive(collectionId, {
      limit: Math.min(limit, 100),
      offset: 0
    });

    return response.items || [];
  } catch (error) {
    console.error('Error fetching collection items:', error);
    return [];
  }
}



