export const prerender = false;

export const POST = async ({ request }) => {
  try {
    const body = await request.json();

    return new Response(
      JSON.stringify({
        success: true,
        received: body,
        step: "REGISTER ROUTE WORKING",
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "JSON parse failed",
        detail: err.message,
      }),
      { status: 500 }
    );
  }
};