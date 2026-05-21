import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const [status, setStatus] = useState("Starting callback...");

  useEffect(() => {
    const run = async () => {
      try {
        setStatus("Processing login...");

        // STEP 1: get URL code
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        console.log("AUTH CALLBACK START");
        console.log("Code exists:", !!code);

        if (!code) {
          setStatus("No auth code found, redirecting...");
          window.location.href = "/login";
          return;
        }

        // STEP 2: exchange code for session (THIS IS CRITICAL)
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        console.log("Exchange result:", data, error);

        if (error || !data.session) {
          setStatus("Auth failed, redirecting...");
          window.location.href = "/login";
          return;
        }

        setStatus("Login successful, checking profile...");

        // STEP 3: check if user exists in DB
        const user = data.session.user;

        const { data: profile } = await supabase
          .from("users")
          .select("username")
          .eq("id", user.id)
          .single();

        // STEP 4: decide NEXT step ONCE
        if (profile?.username) {
          window.location.href = "/";
        } else {
          window.location.href = "/signup-username";
        }
      } catch (err) {
        console.error(err);
        setStatus("Unexpected error, redirecting...");
        window.location.href = "/login";
      }
    };

    run();
  }, []);

  return <h1>{status}</h1>;
}