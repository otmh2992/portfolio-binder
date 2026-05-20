import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { baseUrl } from '../lib/base-url';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!mounted) return;

      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!mounted) return;

        setUserData(data);
      }

      setLoading(false);
    };

    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const u = session?.user ?? null;

        setUser(u);

        if (u) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', u.id)
            .maybeSingle();

          setUserData(data);
        } else {
          setUserData(null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = baseUrl || '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          <nav className="flex items-center gap-6">
            <a href={baseUrl || '/'}>Home</a>
          </nav>

          <div className="flex-1 flex justify-center">
            <a href={baseUrl || '/'}>
              <h1 className="text-2xl font-bold">PLAN Z</h1>
            </a>
          </div>

          <div className="flex items-center gap-4">

            <Button
              size="sm"
              onClick={() => window.location.href = `${baseUrl}/submit`}
            >
              Submit Work
            </Button>

            {loading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded" />
            ) : user && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    {userData.username || userData.full_name}
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">

                  <DropdownMenuLabel>
                    {user.email}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() =>
                      window.location.href = `${baseUrl}/filmmaker/${userData.username}`
                    }
                  >
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = `${baseUrl}/login`}
                >
                  Log In
                </Button>

                <Button
                  size="sm"
                  onClick={() => window.location.href = `${baseUrl}/signup`}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}