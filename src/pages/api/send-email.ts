import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST({ request }) {
  try {
    const { email } = await request.json();

    // 1. generate token
    const token = crypto.randomBytes(32).toString("hex");

    // 2. store token
    const { error } = await supabaseAdmin
      .from("email_verifications")
      .insert({
        email,
        token,
      });

    if (error) throw error;

    // 3. build verification link
    const verifyUrl =
      `${import.meta.env.PUBLIC_SITE_URL}/auth/callback?email=` +
      encodeURIComponent(email) +
      `&token=${token}`;

    // 4. send email via Resend
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
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}