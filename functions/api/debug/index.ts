export const GET = () => {
  console.log("DEBUG HIT");
  return new Response(JSON.stringify({
    ok: true,
    time: new Date().toISOString()
  }), {
    headers: {
      "content-type": "application/json"
    }
  });
};