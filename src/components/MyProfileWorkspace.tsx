import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import UserProfile from './UserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { baseUrl } from '../lib/base-url';

export default function MyProfileWorkspace() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentUserProfile();
  }, []);

  const loadCurrentUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!authData.user) throw new Error('You must be logged in.');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;
      if (!userData?.username) throw new Error('No username found. Complete account setup first.');

      setUsername(userData.username);
    } catch (err: any) {
      setError(err.message || 'Unable to load profile workspace.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !username) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle>Profile Workspace Unavailable</CardTitle>
            <CardDescription>{error || 'Could not load your account profile.'}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button onClick={() => (window.location.href = `${baseUrl}/signup`)}>
              Complete Signup
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = `${baseUrl}/`)}>
              Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-4">
        <h1 className="text-2xl font-bold font-heading">My Profile Workspace</h1>
        <p className="text-sm text-muted-foreground">
          This is your live profile preview page. We will iterate profile features here.
        </p>
      </div>

      <UserProfile username={username} isOwnProfile />
    </div>
  );
}
