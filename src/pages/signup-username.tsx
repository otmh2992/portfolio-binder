import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SmartFilmSelector from "../components/SmartFilmSelector";
import { baseUrl } from "../lib/base-url";

export default function SignupUsername() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setUser(data.user);
      setFullName(data.user.user_metadata?.full_name || "");
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleSelect = (selectedUsername: string) => {
    setUsername(selectedUsername);
  };

  const completeSignup = async () => {
    if (!user) return;

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      username,
      full_name: fullName,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = `${baseUrl}/`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading your identity...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Choose your filmmaker identity
      </h1>

      <SmartFilmSelector onSelect={handleSelect} />

      {username && (
        <button
          onClick={completeSignup}
          className="mt-6 bg-black text-white px-4 py-2"
        >
          Continue as {username}
        </button>
      )}
    </div>
  );
}