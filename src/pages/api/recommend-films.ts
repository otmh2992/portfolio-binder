import type { APIRoute } from 'astro';
import { getRecommendedFilms } from '../../lib/tmdb';

/**
 * API endpoint for intelligent film recommendations
 * Based on user's last watched film
 */
export const GET: APIRoute = async ({ url }) => {
  const filmTitle = url.searchParams.get('film');

  if (!filmTitle) {
    return new Response(
      JSON.stringify({ error: 'Missing film parameter' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }

  try {
    const recommendations = await getRecommendedFilms(filmTitle);
    
    return new Response(
      JSON.stringify({
        success: true,
        inputFilm: filmTitle,
        recommendations,
        count: recommendations.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error) {
    console.error('Recommendation error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch recommendations',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  }
};
