export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const objectKey = url.pathname.slice(1);

    // Handle OPTIONS request for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        }
      });
    }

    // Check if objectKey exists
    if (!objectKey) {
      return new Response('No video specified', { status: 400 });
    }

    try {
      // Get the Range header
      const range = request.headers.get('Range');
      
      // Fetch object from R2 with range support
      const object = await env.VIDEOS.get(objectKey, {
        range: range ? request.headers : undefined,
        onlyIf: request.headers,
      });

      if (object === null) {
        return new Response('Video not found', { status: 404 });
      }

      // Detect content type from file extension
      const ext = objectKey.toLowerCase().split('.').pop();
      const contentTypes = {
        'mp4': 'video/mp4',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'webm': 'video/webm',
        'mkv': 'video/x-matroska',
      };
      const contentType = contentTypes[ext] || 'video/mp4';

      // Build response headers
      const headers = new Headers();
      
      // Copy R2 HTTP metadata
      object.writeHttpMetadata(headers);
      
      // Override/set critical headers
      headers.set('Content-Type', contentType);
      headers.set('Content-Disposition', 'inline');
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Accept-Ranges', 'bytes');
      headers.set('Cache-Control', 'public, max-age=31536000');

      // Determine status code based on range request
      const status = object.range ? 206 : 200;

      return new Response(object.body, {
        status,
        headers,
      });

    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }
}
