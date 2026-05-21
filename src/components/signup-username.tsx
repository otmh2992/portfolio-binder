import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupUsername() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      // STEP 1: WAIT for session
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      console.log("Signup page session:", session);

      if (!session) {
        // IMPORTANT: small delay avoids hydration race bugs
        setTimeout(() => {
          window.location.href = "/login";
        }, 300);
        return;
      }

      setSession(session);

      // STEP 2: check profile AFTER session is confirmed
      const { data: profile } = await supabase
        .from("users")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (profile?.username) {
        window.location.href = "/";
        return;
      }

      setLoading(false);
    };

    run();
  }, []);

  const handleSave = async () => {
    setError("");

    if (!username.trim()) {
      setError("Please choose a username");
      return;
    }

    if (!session) {
      setError("Session not ready yet");
      return;
    }

    const { error } = await supabase.from("users").upsert({
      id: session.user.id,
      email: session.user.email,
      username: username.trim(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      setError("Failed to save username");
      return;
    }

    window.location.href = "/";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", textAlign: "center" }}>
      <h1>Choose your username</h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        style={{ padding: "10px", width: "100%" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Continue
      </button>
    </div>
  );
}