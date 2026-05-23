export const prerender = false;

export async function GET({ locals }) {
  try {
    // Cloudflare KV binding (Astro Cloudflare adapter)
    const env = locals.runtime?.env;

    if (!env?.SESSION) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "KV binding SESSION not found",
        }),
        { status: 500 }
      );
    }

    // write test value
    await env.SESSION.put("kv_test", "it works!");

    // read it back
    const value = await env.SESSION.get("kv_test");

    return new Response(
      JSON.stringify({
        ok: true,
        value,
        message: "KV is working correctly",
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: String(err),
      }),
      { status: 500 }
    );
  }
}