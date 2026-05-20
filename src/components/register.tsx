import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setMessage("Check your email for a verification link.");

    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        textAlign: "center",
      }}
    >
      <h1>Create Account</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginTop: "20px",
        }}
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "20px",
            color: message.toLowerCase().includes("failed")
              ? "red"
              : "inherit",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}