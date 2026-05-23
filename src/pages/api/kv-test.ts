export const GET = async ({ locals }) => {
  try {
    const result = await locals.runtime.env.SESSION?.get("test");

    return new Response(
      JSON.stringify({
        ok: true,
        kvValue: result ?? null,
        message: "KV working"
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json"
        }
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(err)
      }),
      { status: 500 }
    );
  }
};