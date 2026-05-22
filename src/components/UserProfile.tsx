import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Portfolio } from '../lib/types';
import { baseUrl } from '../lib/base-url';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface UserProfileProps {
  username: string;
  isOwnProfile?: boolean;
}

export default function UserProfile({ username, isOwnProfile = false }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, [username]);

  const loadUserProfile = async () => {
    try {
      console.log('[UserProfile] Loading:', username);

      setLoading(true);
      setError(null);

      // STEP 1: fetch user (DO NOT use .single() → it can crash)
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);

      if (userError) {
        console.error('[UserProfile] User fetch error:', userError);
        throw userError;
      }

      if (!users || users.length === 0) {
        console.warn('[UserProfile] User not found:', username);
        setUser(null);
        setLoading(false);
        return;
      }

      const userData = users[0];
      setUser(userData);

      // STEP 2: fetch portfolios safely
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (portfolioError) {
        console.error('[UserProfile] Portfolio error:', portfolioError);
        throw portfolioError;
      }

      setPortfolios(portfolioData || []);

    } catch (err: any) {
      console.error('[UserProfile] Fatal error:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ✅ FIXED: proper not-found handling
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              {error || `No user found for "${username}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = `${baseUrl}/`}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="max-w-6xl mx-auto">

      {/* PROFILE HEADER */}
      <div className="bg-card border rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">

          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.full_name || user.username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {user.full_name || user.username}
              </h1>

              <Badge>
                {user.role || 'user'}
              </Badge>
            </div>

            <p className="text-muted-foreground mb-4">
              @{user.username}
            </p>

            {user.bio && (
              <p className="mb-4">{user.bio}</p>
            )}

            <div className="flex gap-4 text-sm text-muted-foreground">
              {user.location && <span>📍 {user.location}</span>}
              {user.website && (
                <a href={user.website} target="_blank">
                  🌐 Website
                </a>
              )}
            </div>
          </div>

          {isOwnProfile && (
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = `${baseUrl}/settings`}>
                Edit Profile
              </Button>
              <Button variant="outline"
                onClick={() => window.location.href = `${baseUrl}/submit`}>
                Upload Work
              </Button>
            </div>
          )}

        </div>
      </div>

      {/* PORTFOLIO */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Portfolio <span className="text-muted-foreground">({portfolios.length})</span>
        </h2>

        {portfolios.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No portfolio items yet
            </CardContent>
          </Card>
        ) : (
          <div className="asymmetric-grid">
            {portfolios.map((item) => (
              <div key={item.id} className="portfolio-item">
                {item.thumbnail_url ? (
                  <img src={item.thumbnail_url} alt={item.title} />
                ) : (
                  <div className="portfolio-placeholder">
                    No media
                  </div>
                )}

                <div className="portfolio-overlay">
                  <h3>{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}