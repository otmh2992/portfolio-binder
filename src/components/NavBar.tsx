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
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserData(session.user.id);
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await loadUserData(user.id);
    }
    setLoading(false);
  };

  const loadUserData = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    console.log('Loaded user data:', data); // Debug log
    setUserData(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = baseUrl || '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Navigation */}
          <nav className="flex items-center gap-6">
            <a href={baseUrl || '/'} className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </a>
            {/* Temporarily removed until pages are created:
            <a href={`${baseUrl}/explore`} className="text-sm font-medium transition-colors hover:text-primary">
              Explore
            </a>
            <a href={`${baseUrl}/about`} className="text-sm font-medium transition-colors hover:text-primary">
              About
            </a>
            */}
          </nav>

          {/* Center Logo */}
          <div className="flex-1 flex justify-center">
            <a href={baseUrl || '/'}>
              <h1 className="text-2xl font-bold font-heading">PLAN Z</h1>
            </a>
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center gap-4">
            {/* Submit Work Button - Always visible */}
            <Button 
              variant="default" 
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
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="text-sm font-medium">
                      {userData.full_name || userData.username}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">{userData.full_name || userData.username}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.location.href = `${baseUrl}/filmmaker/${userData.username}`}>
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = `${baseUrl}/profile`}>
                    Profile Workspace
                  </DropdownMenuItem>
                  {/* Temporarily removed until pages are created:
                  <DropdownMenuItem onClick={() => window.location.href = `${baseUrl}/settings`}>
                    Settings
                  </DropdownMenuItem>
                  {userData.role === 'filmmaker' && (
                    <DropdownMenuItem onClick={() => window.location.href = `${baseUrl}/upload`}>
                      Upload Work
                    </DropdownMenuItem>
                  )}
                  */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => window.location.href = `${baseUrl}/login`}>
                  Log In
                </Button>
                <Button size="sm" onClick={() => window.location.href = `${baseUrl}/signup`}>
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










