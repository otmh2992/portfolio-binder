// Custom worker entrypoint that handles the /portfolio-binder base path
import worker from '../dist/_worker.js/index.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Strip /portfolio-binder prefix if present
    if (url.pathname.startsWith('/portfolio-binder')) {
      url.pathname = url.pathname.replace('/portfolio-binder', '') || '/';
      request = new Request(url, request);
    }
    
    // Call the Astro worker
    return worker.fetch(request, env, ctx);
  }
};
