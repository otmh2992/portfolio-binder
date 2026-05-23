import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const kv = locals.runtime.env.SESSION;

    await kv.put("test-key", "hello");
    const value = await kv.get("test-key");

    return new Response(
      JSON.stringify({
        success: true,
        value,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      { status: 500 }
    );
  }
};