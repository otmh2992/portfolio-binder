import type { APIRoute } from "astro";
import { uploadToR2 } from "../../lib/r2";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // ----------------------------
    // 1. Supabase Auth
    // ----------------------------
    const supabaseUrl =
      locals?.runtime?.env?.SUPABASE_URL ||
      import.meta.env.SUPABASE_URL;

    const supabaseAnonKey =
      locals?.runtime?.env?.SUPABASE_ANON_KEY ||
      import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ message: "Missing Supabase configuration" }),
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("Authorization");
    const authToken = authHeader?.replace("Bearer ", "");

    if (!authToken) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Verify user
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        apikey: supabaseAnonKey,
      },
    });

    if (!userResponse.ok) {
      return new Response(
        JSON.stringify({ message: "Invalid authentication" }),
        { status: 401 }
      );
    }

    const user = await userResponse.json();

    // ----------------------------
    // 2. Get uploaded file
    // ----------------------------
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ message: "No file provided" }),
        { status: 400 }
      );
    }

    // Optional validation (recommended)
    if (!file.type.startsWith("video/")) {
      return new Response(
        JSON.stringify({ message: "Only video uploads allowed" }),
        { status: 400 }
      );
    }

    // ----------------------------
    // 3. Upload to R2 (clean helper)
    // ----------------------------
    const url = await uploadToR2(file, locals);

    // ----------------------------
    // 4. Return response
    // ----------------------------
    return new Response(
      JSON.stringify({
        success: true,
        url,
        userId: user.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Upload error:", error);

    return new Response(
      JSON.stringify({
        message: error?.message || "Upload failed",
      }),
      { status: 500 }
    );
  }
};