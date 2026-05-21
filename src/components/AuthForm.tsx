import { useState } from 'react';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🔥 FORM SUBMITTED");

    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        console.log("🔥 SIGNUP STARTED");

        const res = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            fullName,
          }),
        });

        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }

        console.log("📡 API RESPONSE:", res.status, data);

        if (!res.ok) {
          throw new Error(data?.error || 'Signup failed');
        }

        window.location.href = '/check-email';
        return;
      }

      setError('Login is disabled right now.');
    } catch (err: any) {
      console.error('💥 AUTH ERROR:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isSignup ? 'Sign Up' : 'Login'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        {isSignup && (
          <input
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border p-2"
          />
        )}

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button disabled={loading} className="w-full bg-black text-white p-2">
          {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Login'}
        </button>
      </form>
    </div>
  );
}