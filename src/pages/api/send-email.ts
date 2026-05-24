import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST({ request }) {
  try {
    const { email } = await request.json();

    const token = generateToken();

    const { error } = await supabaseAdmin
      .from("email_verifications")
      .insert({
        email,
        token,
      });

    if (error) throw error;

    const verifyUrl =
      `${import.meta.env.PUBLIC_SITE_URL}/auth/callback?email=` +
      encodeURIComponent(email) +
      `&token=${token}`;

    await resend.emails.send({
      from: "PLAN Z <hal@planzzz.com>",
      to: email,
      subject: "Verify your PLAN Z account",
      html: `
        <h1>Verify your account</h1>
        <p>Click below to continue:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}