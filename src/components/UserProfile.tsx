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
      setLoading(true);
      setError(null);

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('User not found');

      setUser(userData);

      // Fetch user's portfolios
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      if (portfolioError) throw portfolioError;

      setPortfolios(portfolioData || []);
    } catch (err: any) {
      setError(err.message);
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

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>{error || 'User does not exist'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = baseUrl || '/'}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-card border rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || user.username} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.full_name || user.username)}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading">{user.full_name || user.username}</h1>
              <Badge variant={user.role === 'filmmaker' ? 'default' : 'secondary'}>
                {user.role}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">@{user.username}</p>
            
            {user.bio && (
              <p className="text-foreground mb-4">{user.bio}</p>
            )}

            <div className="flex gap-4 text-sm text-muted-foreground">
              {user.location && (
                <span>📍 {user.location}</span>
              )}
              {user.website && (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isOwnProfile && (
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = `${baseUrl}/settings`}>
                Edit Profile
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = `${baseUrl}/upload`}
              >
                Upload Work
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div>
        <h2 className="text-2xl font-bold font-heading mb-6">
          {isOwnProfile ? 'Your Portfolio' : 'Portfolio'}
          <span className="text-muted-foreground ml-2">({portfolios.length})</span>
        </h2>

        {portfolios.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {isOwnProfile 
                  ? "You haven't uploaded any work yet" 
                  : "No portfolio items yet"}
              </p>
              {isOwnProfile && (
                <Button onClick={() => window.location.href = `${baseUrl}/upload`}>
                  Upload Your First Work
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="asymmetric-grid">
            {portfolios.map((item) => (
              <div key={item.id} className="portfolio-item">
                <div className="portfolio-item-inner">
                  {item.thumbnail_url ? (
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="portfolio-image"
                    />
                  ) : (
                    <div className="portfolio-placeholder">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Video</span>
                    </div>
                  )}
                  
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3 className="portfolio-title">{item.title}</h3>
                      {item.description && (
                        <p className="portfolio-description">{item.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

