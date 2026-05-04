import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function AuthCallback() {
  useEffect(() => {
    const supabase = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY
    );

    const handle = async () => {
      // Wait for Supabase to restore session from email link
      const { data } = await supabase.auth.getSession();

      const user = data.session?.user;

      if (!user) {
        window.location.href = '/login';
        return;
      }

      // OPTIONAL: small delay for UX (feels like processing)
      setTimeout(() => {
        window.location.href = '/signup/username';
      }, 800);
    };

    handle();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verifying your account...</p>
    </div>
  );
}