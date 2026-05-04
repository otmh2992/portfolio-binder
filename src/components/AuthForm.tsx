import { useState } from 'react';
import { baseUrl } from '../lib/base-url';
import SmartFilmSelector from './SmartFilmSelector';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const isSignup = mode === 'signup';

  const handleUsernameSelect = (selectedUsername: string) => {
    setUsername(selectedUsername);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const { createClient } = await import('@supabase/supabase-js');

      const supabase = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      );

      // ---------------- SIGNUP FLOW ----------------
      if (isSignup) {
        if (step === 1) {
          if (!email || !password || !fullName) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
          }

          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
              emailRedirectTo: `${window.location.origin}/signup-username`,
            },
          });

          if (error) throw error;

          setStep(2);
          setSuccessMessage('Check your email to verify your account.');
          return;
        }

        if (step === 2) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (!data.user?.email_confirmed_at) {
            await supabase.auth.signOut();
            throw new Error('Please verify your email first.');
          }

          setStep(3);
          setSuccessMessage('Email verified. Choose your username.');
          return;
        }

        if (step === 3) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          const { error: profileError } = await supabase.from('users').upsert({
            id: data.user.id,
            email,
            username,
            full_name: fullName,
            created_at: new Date().toISOString(),
          });

          if (profileError) throw profileError;

          window.location.href = `${baseUrl}/`;
        }
      }

      // ---------------- LOGIN FLOW ----------------
      else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (!data.user?.email_confirmed_at) {
          await supabase.auth.signOut();
          throw new Error('Please verify your email before logging in.');
        }

        window.location.href = `${baseUrl}/`;
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN UI ----------------
  if (!isSignup) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <button className="w-full bg-black text-white p-2">
            Login
          </button>
        </form>
      </div>
    );
  }

  // ---------------- SIGNUP UI ----------------
  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg">

      {step === 1 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button className="w-full bg-black text-white p-2">
            Create Account
          </button>
        </form>
      )}

      {step === 2 && (
        <div>
          <p>Check your email: {email}</p>

          <button onClick={handleSubmit}>
            I've verified my email
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <SmartFilmSelector onSelect={handleUsernameSelect} />

          {username && (
            <button onClick={handleSubmit}>
              Complete signup
            </button>
          )}
        </div>
      )}
    </div>
  );
}