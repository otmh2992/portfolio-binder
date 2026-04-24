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
  const [selectedFilmTitle, setSelectedFilmTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step signup

  const isSignup = mode === 'signup';

  const handleUsernameSelect = (selectedUsername: string, filmTitle: string) => {
    setUsername(selectedUsername);
    setSelectedFilmTitle(filmTitle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Import Supabase client
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
      const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase configuration missing');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      if (isSignup) {
        // Step 1: Collect email/password
        if (step === 1) {
          if (!email || !password || !fullName) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
          }
          setStep(2); // Move to username selection
          setLoading(false);
          return;
        }

        // Step 2: Username already selected via FilmUsernameSelector
        if (step === 2 && !username) {
          setError('Please select a filmmaker name');
          setLoading(false);
          return;
        }

        // Step 3: Create account
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${baseUrl}/`,
            data: {
              full_name: fullName,
              username: username,
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create user profile with film username
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: email,
                username: username,
                full_name: fullName,
                created_at: new Date().toISOString(),
              },
            ]);

          if (profileError) throw profileError;

          // Check if email confirmation is required
          if (authData.session === null) {
            // Email confirmation required
            setError('');
            alert('Success! Please check your email to confirm your account before logging in.');
            window.location.href = `${baseUrl}/login`;
          } else {
            // No confirmation required, redirect to home
            window.location.href = `${baseUrl}/`;
          }
        }
      } else {
        // Login flow (unchanged)
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) throw loginError;

        window.location.href = `${baseUrl}/`;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN FORM
  if (!isSignup) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
        <h2 className="text-3xl font-bold font-heading mb-6">Login</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href={`${baseUrl}/signup`} className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    );
  }

  // SIGNUP FORM - Multi-step
  return (
    <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
      {/* Step 1: Email & Password */}
      {step === 1 && (
        <>
          <h2 className="text-3xl font-bold font-heading mb-2">Create Account</h2>
          <p className="text-muted-foreground mb-6">Step 1 of 2</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Troy Belmiore"
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Continue →'}
            </button>
          </form>
        </>
      )}

      {/* Step 2: Film Username Selection */}
      {step === 2 && (
        <>
          <div className="mb-6">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              ← Back
            </button>
            <p className="text-sm text-muted-foreground">Step 2 of 2</p>
          </div>

          <SmartFilmSelector onSelect={handleUsernameSelect} />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mt-4">
              {error}
            </div>
          )}

          {username && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-3 rounded-lg transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          )}
        </>
      )}

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <a href={`${baseUrl}/login`} className="text-primary hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}




