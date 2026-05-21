import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'filmmaker' | 'backer' | 'admin';
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        window.location.href = redirectTo;
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
        error: authError,
      } = await supabase.auth.getSession();

      if (authError || !session) {
        window.location.href = redirectTo;
        return;
      }

      const user = session.user;
      setAuthUser(user);

      if (requiredRole) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        if (userError || !userData) {
          window.location.href = redirectTo;
          return;
        }

        setUserRole(userData.role);

        if (userData.role !== requiredRole) {
          setAuthorized(false);
          setLoading(false);
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    } catch (err) {
      console.error('Auth check error:', err);
      window.location.href = redirectTo;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              {requiredRole
                ? `This page requires ${requiredRole} access. Your current role: ${userRole}`
                : 'You need to be logged in to access this page.'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className="w-full" onClick={() => (window.location.href = '/')}>
              Go to Home
            </Button>

            {requiredRole && userRole && (
              <Button
                className="w-full mt-2"
                onClick={() => (window.location.href = '/upgrade')}
              >
                Upgrade to {requiredRole}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}