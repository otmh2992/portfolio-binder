import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST({ request }) {
  const { email } = await request.json();

  try {
    // 1. Generate secure Supabase verification link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      options: {
        redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) throw error;

    const verifyUrl = data?.properties?.action_link;

    // 2. Send email via Resend
    await resend.emails.send({
      from: "PLAN Z <hal@planzzz.com>",
      to: email,
      subject: "Confirm your email",
      html: `<a href="${verifyUrl}">Verify your account</a>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}