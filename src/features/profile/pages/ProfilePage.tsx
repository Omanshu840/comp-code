
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type FormEvent, useEffect, useState } from 'react';

export function ProfilePage() {
  const { session, supabase } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    try {
      await updateProfile({ username, full_name: fullName });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile.');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Could not load profile.</div>;
  }

  return (
    <div className="p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={session?.user?.email || ''} disabled />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
          <Button onClick={handleLogout} variant="destructive" className="mt-4 w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
