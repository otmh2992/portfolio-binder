import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SignupUsername() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        const user = data?.user;

        if (error || !user) {
          window.location.href = "/login";
          return;
        }

        // check existing profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          console.warn("Profile fetch warning:", profileError);
        }

        // already exists → skip
        if (profile?.username) {
          window.location.href = "/";
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Init error:", err);
        window.location.href = "/login";
      }
    };

    init();
  }, []);

  const handleSave = async () => {
    setError("");

    if (!username.trim()) {
      setError("Please choose a username");
      return;
    }

    const { data, error: userError } = await supabase.auth.getUser();

    const user = data?.user;

    if (userError || !user) {
      setError("No user session found");
      return;
    }

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      username: username.trim(),
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
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
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginTop: "20px",
        }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleSave} style={{ marginTop: "20px" }}>
        Continue
      </button>
    </div>
  );
}