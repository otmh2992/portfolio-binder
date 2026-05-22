export const GET = ({ request }) => {
  return new Response(JSON.stringify({
    url: request.url,
    host: request.headers.get("host"),
    timestamp: Date.now()
  }), {
    headers: { "Content-Type": "application/json" }
  });
};